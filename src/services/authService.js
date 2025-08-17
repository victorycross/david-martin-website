// GitHub OAuth Authentication Service
class AuthService {
  constructor() {
    // GitHub OAuth App configuration
    // You'll need to create a GitHub OAuth App and replace these values
    this.clientId = 'YOUR_GITHUB_CLIENT_ID'; // Replace with your GitHub OAuth App Client ID
    this.redirectUri = window.location.origin + '/admin';
    this.scope = 'repo user:email';
    
    // OAuth endpoints
    this.authorizeUrl = 'https://github.com/login/oauth/authorize';
    this.tokenUrl = 'https://github.com/login/oauth/access_token';
    this.userApiUrl = 'https://api.github.com/user';
    
    // Storage keys
    this.tokenKey = 'github_oauth_token';
    this.userKey = 'github_user_info';
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // Get stored access token
  getStoredToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Get stored user info
  getStoredUser() {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  // Store authentication data
  storeAuthData(token, user) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Clear authentication data
  clearAuthData() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Redirect to GitHub OAuth
  redirectToGitHub() {
    const state = this.generateRandomState();
    localStorage.setItem('oauth_state', state);
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      state: state,
      allow_signup: 'false' // Only allow existing GitHub users
    });

    window.location.href = `${this.authorizeUrl}?${params.toString()}`;
  }

  // Handle OAuth callback
  async handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);

    if (error) {
      throw new Error(`OAuth error: ${error}`);
    }

    if (!code) {
      return false; // No OAuth callback
    }

    // Verify state parameter
    const storedState = localStorage.getItem('oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid OAuth state parameter');
    }
    localStorage.removeItem('oauth_state');

    try {
      // Exchange code for access token
      const token = await this.exchangeCodeForToken(code);
      
      // Get user information
      const user = await this.getUserInfo(token);
      
      // Verify user has access to the repository
      await this.verifyRepositoryAccess(token);
      
      // Store authentication data
      this.storeAuthData(token, user);
      
      return true;
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code) {
    // Note: In a production app, this should be done on your backend
    // For GitHub Pages, we'll use a proxy service or implement client-side flow
    
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: 'YOUR_CLIENT_SECRET', // In production, this should be on backend
        code: code,
        redirect_uri: this.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Token exchange error: ${data.error_description}`);
    }

    return data.access_token;
  }

  // Get user information from GitHub API
  async getUserInfo(token) {
    const response = await fetch(this.userApiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user information');
    }

    return response.json();
  }

  // Verify user has access to the repository
  async verifyRepositoryAccess(token) {
    const repoUrl = 'https://api.github.com/repos/victorycross/david-martin-website';
    
    const response = await fetch(repoUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error('User does not have access to the repository');
    }

    const repo = await response.json();
    
    // Check if user has write access
    if (!repo.permissions || !repo.permissions.push) {
      throw new Error('User does not have write access to the repository');
    }

    return true;
  }

  // Generate random state for OAuth security
  generateRandomState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Logout user
  logout() {
    this.clearAuthData();
    window.location.reload();
  }

  // Get current user info
  getCurrentUser() {
    return this.getStoredUser();
  }

  // Get access token for API calls
  getAccessToken() {
    return this.getStoredToken();
  }
}

export default new AuthService();