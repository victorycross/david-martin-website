// Netlify function for GitHub OAuth proxy
// This handles the OAuth flow for Decap CMS

exports.handler = async (event, context) => {
  const { httpMethod, queryStringParameters, body } = event;
  
  // Handle preflight requests
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  // GitHub OAuth endpoint
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'GitHub OAuth credentials not configured' 
      })
    };
  }

  try {
    if (httpMethod === 'GET' && queryStringParameters.code) {
      // Exchange code for access token
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code: queryStringParameters.code,
        }),
      });

      const data = await response.json();

      if (data.access_token) {
        // Return success with token
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/html',
          },
          body: `
            <!DOCTYPE html>
            <html>
              <head>
                <title>Authentication Success</title>
              </head>
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
      } else {
        throw new Error('Failed to get access token');
      }
    }

    // Default response for auth initiation
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        message: 'GitHub OAuth proxy ready',
        client_id: GITHUB_CLIENT_ID 
      })
    };

  } catch (error) {
    console.error('OAuth Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Authentication failed',
        details: error.message 
      })
    };
  }
};