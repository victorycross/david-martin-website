export const handler = async (event, context) => {
  const { httpMethod, queryStringParameters } = event;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight
  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Get environment variables
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'OAuth credentials not configured' })
    };
  }

  try {
    // Handle OAuth callback (when GitHub redirects back with code)
    if (queryStringParameters?.code) {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: queryStringParameters.code,
        }),
      });

      const data = await response.json();

      if (data.access_token) {
        return {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'text/html' },
          body: `
            <!DOCTYPE html>
            <html>
              <head><title>Authentication Success</title></head>
              <body>
                <script>
                  window.opener.postMessage({
                    type: 'authorization_response',
                    access_token: '${data.access_token}',
                    token_type: 'bearer'
                  }, '*');
                  window.close();
                </script>
              </body>
            </html>
          `
        };
      }
      
      throw new Error('Failed to get access token');
    }

    // Initial OAuth request - redirect to GitHub
    const scope = queryStringParameters?.scope || 'repo';
    const redirectUri = 'https://monumental-truffle-405167.netlify.app/.netlify/functions/auth';
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    return {
      statusCode: 302,
      headers: { ...headers, Location: githubUrl },
      body: ''
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};