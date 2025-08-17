// Secure Authentication Service using GitHub API verification
class SecureAuthService {
  constructor() {
    this.baseUrl = 'https://api.github.com';
    this.repoOwner = 'victorycross';
    this.repoName = 'david-martin-website';
    
    // Storage keys
    this.tokenKey = 'github_auth_token';
    this.userKey = 'github_auth_user';
    this.sessionKey = 'github_auth_session';
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    const session = this.getStoredSession();
    
    if (!token || !user || !session) {
      return false;
    }

    // Check if session is expired (24 hours)
    const sessionTime = new Date(session.timestamp);
    const now = new Date();
    const hoursDiff = (now - sessionTime) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      this.clearAuthData();
      return false;
    }

    return true;
  }

  // Authenticate with GitHub token
  async authenticate(token) {
    if (!token || !token.trim()) {
      throw new Error('Token is required');
    }

    try {
      // Verify token with GitHub API
      const user = await this.verifyToken(token.trim());
      
      // Verify repository access
      await this.verifyRepositoryAccess(token.trim());
      
      // Check if user is the repository owner or collaborator
      await this.verifyUserPermissions(token.trim(), user.login);
      
      // Store authentication data
      this.storeAuthData(token.trim(), user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  // Verify token with GitHub API
  async verifyToken(token) {
    const response = await fetch(`${this.baseUrl}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid GitHub token');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  }

  // Verify repository access
  async verifyRepositoryAccess(token) {
    const response = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Repository not found or access denied');
      }
      throw new Error(`Repository access error: ${response.status}`);
    }

    const repo = await response.json();
    
    // Check if user has push access
    if (!repo.permissions || !repo.permissions.push) {
      throw new Error('Insufficient repository permissions. You need write access.');
    }

    return repo;
  }

  // Verify user permissions (owner or collaborator)
  async verifyUserPermissions(token, username) {
    // Check if user is the repository owner
    const repoResponse = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (repoResponse.ok) {
      const repo = await repoResponse.json();
      if (repo.owner.login === username) {
        return true; // User is the owner
      }
    }

    // Check if user is a collaborator
    const collabResponse = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}/collaborators/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!collabResponse.ok) {
      throw new Error('You must be the repository owner or a collaborator to access the admin panel');
    }

    return true;
  }

  // Store authentication data
  storeAuthData(token, user) {
    const session = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent.substring(0, 100), // Basic fingerprinting
    };

    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
  }

  // Get stored token
  getStoredToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Get stored user
  getStoredUser() {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  // Get stored session
  getStoredSession() {
    const sessionJson = localStorage.getItem(this.sessionKey);
    return sessionJson ? JSON.parse(sessionJson) : null;
  }

  // Clear authentication data
  clearAuthData() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.sessionKey);
  }

  // Logout
  logout() {
    this.clearAuthData();
  }

  // Get current user
  getCurrentUser() {
    return this.getStoredUser();
  }

  // Get access token for API calls
  getAccessToken() {
    return this.getStoredToken();
  }

  // Refresh session
  async refreshSession() {
    const token = this.getStoredToken();
    if (!token) {
      throw new Error('No token available');
    }

    try {
      const user = await this.verifyToken(token);
      await this.verifyRepositoryAccess(token);
      await this.verifyUserPermissions(token, user.login);
      
      // Update session timestamp
      const session = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent.substring(0, 100),
      };
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
      
      return true;
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  // Check token permissions and scopes
  async checkTokenPermissions(token) {
    try {
      // Check token scopes
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`Token validation failed: ${response.status}`);
      }

      // Get token scopes from response headers
      const scopes = response.headers.get('X-OAuth-Scopes') || '';
      const tokenScopes = scopes.split(',').map(s => s.trim()).filter(Boolean);

      // Check repository-specific permissions
      const repoResponse = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      let repoPermissions = {};
      if (repoResponse.ok) {
        const repo = await repoResponse.json();
        repoPermissions = repo.permissions || {};
      }

      return {
        scopes: tokenScopes,
        hasRepo: tokenScopes.includes('repo'),
        hasContents: tokenScopes.includes('repo') || tokenScopes.includes('contents:write'),
        repoPermissions: repoPermissions,
        canPush: repoPermissions.push || false,
        canWrite: repoPermissions.admin || repoPermissions.push || false
      };
    } catch (error) {
      console.error('Error checking token permissions:', error);
      throw error;
    }
  }

  // Generate secure token instructions
  getTokenInstructions() {
    return {
      title: "Create a GitHub Personal Access Token",
      steps: [
        "Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)",
        "Click 'Generate new token (classic)'",
        "Give it a descriptive name like 'David Martin Website Admin'",
        "Select expiration (recommend 90 days for security)",
        "Select scopes: 'repo' (Full control of private repositories) - THIS IS CRITICAL",
        "Make sure 'repo' includes all sub-permissions (repo:status, repo_deployment, public_repo, repo:invite, security_events)",
        "Click 'Generate token' and copy it immediately",
        "Paste the token in the field below"
      ],
      security: [
        "Tokens expire automatically for security",
        "Only repository owners/collaborators can access admin panel", 
        "Sessions expire after 24 hours",
        "Tokens are verified against GitHub API on each login"
      ],
      troubleshooting: [
        "If save fails: Token needs 'repo' scope (not just 'public_repo')",
        "If 403 errors: You may not be a repository collaborator",
        "If 404 errors: Repository may be private and token lacks access",
        "Try regenerating token with full 'repo' permissions"
      ]
    };
  }
}

export default new SecureAuthService();