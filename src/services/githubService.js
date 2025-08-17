// GitHub API service for content management
class GitHubService {
  constructor() {
    this.owner = 'victorycross';
    this.repo = 'david-martin-website';
    this.branch = 'main';
    this.baseUrl = 'https://api.github.com';
    
    // These would typically be stored more securely
    // For now, we'll use a simple approach that requires manual token setup
    this.token = null;
  }

  // Set the GitHub personal access token
  setToken(token) {
    this.token = token;
    localStorage.setItem('github_token', token);
  }

  // Get token from localStorage or prompt user
  getToken() {
    if (this.token) return this.token;
    
    const stored = localStorage.getItem('github_token');
    if (stored) {
      this.token = stored;
      return stored;
    }
    
    return null;
  }

  // Make authenticated request to GitHub API
  async makeRequest(endpoint, options = {}) {
    const token = this.getToken();
    if (!token) {
      throw new Error('GitHub token not configured. Please set up your GitHub personal access token.');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`GitHub API Error: ${response.status} - ${error.message}`);
    }

    return response.json();
  }

  // Get current content file
  async getContentFile() {
    try {
      const response = await this.makeRequest(
        `/repos/${this.owner}/${this.repo}/contents/src/data/content.json?ref=${this.branch}`
      );
      
      // Decode base64 content
      const content = JSON.parse(atob(response.content));
      return {
        content,
        sha: response.sha
      };
    } catch (error) {
      console.error('Error fetching content file:', error);
      
      // If file doesn't exist (404), return null
      if (error.message.includes('404')) {
        console.log('Content file does not exist, will create new one');
        return null;
      }
      
      throw error;
    }
  }

  // Update content file
  async updateContentFile(newContent, commitMessage = 'Update website content via admin panel') {
    try {
      console.log('Updating content file with:', { newContent, commitMessage });
      
      // First get the current file to get its SHA (if it exists)
      const currentFile = await this.getContentFile();
      
      // Prepare the updated content
      const encodedContent = btoa(JSON.stringify(newContent, null, 2));
      
      // Prepare request body
      const requestBody = {
        message: `${commitMessage}\n\n🤖 Generated with Claude Code Admin Panel\n\nCo-Authored-By: Claude <noreply@anthropic.com>`,
        content: encodedContent,
        branch: this.branch
      };
      
      // Add SHA only if file exists
      if (currentFile && currentFile.sha) {
        requestBody.sha = currentFile.sha;
        console.log('Updating existing file with SHA:', currentFile.sha);
      } else {
        console.log('Creating new content file');
      }
      
      console.log('Making GitHub API request...');
      const response = await this.makeRequest(
        `/repos/${this.owner}/${this.repo}/contents/src/data/content.json`,
        {
          method: 'PUT',
          body: JSON.stringify(requestBody)
        }
      );

      console.log('GitHub API response:', response);
      return response;
    } catch (error) {
      console.error('Error updating content file:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Update specific section of content
  async updateSection(sectionName, sectionData) {
    try {
      console.log(`Updating section: ${sectionName}`);
      console.log('Section data size:', JSON.stringify(sectionData).length, 'characters');
      console.log('Section data preview:', JSON.stringify(sectionData).substring(0, 200));
      
      const currentFile = await this.getContentFile();
      
      // If no current file, create with default structure
      const baseContent = currentFile ? currentFile.content : {};
      
      const updatedContent = {
        ...baseContent,
        [sectionName]: sectionData
      };

      console.log('Updated content structure:', Object.keys(updatedContent));
      console.log('Total content size:', JSON.stringify(updatedContent).length, 'characters');

      const result = await this.updateContentFile(
        updatedContent,
        `Update ${sectionName} section content`
      );
      
      console.log(`Successfully updated ${sectionName} section`);
      return result;
    } catch (error) {
      console.error(`Error updating ${sectionName} section:`, error);
      console.error('Section data:', JSON.stringify(sectionData).substring(0, 500));
      console.error('Error response:', error.response || 'No response data');
      throw error;
    }
  }

  // Test connection and permissions
  async testConnection() {
    try {
      await this.makeRequest(`/repos/${this.owner}/${this.repo}`);
      return { success: true, message: 'GitHub connection successful' };
    } catch (error) {
      return { 
        success: false, 
        message: `Connection failed: ${error.message}` 
      };
    }
  }

  // Get repository information
  async getRepoInfo() {
    try {
      const repo = await this.makeRequest(`/repos/${this.owner}/${this.repo}`);
      const user = await this.makeRequest('/user');
      
      return {
        repo: {
          name: repo.name,
          fullName: repo.full_name,
          private: repo.private,
          url: repo.html_url
        },
        user: {
          login: user.login,
          name: user.name,
          avatar: user.avatar_url
        }
      };
    } catch (error) {
      console.error('Error getting repo info:', error);
      throw error;
    }
  }

  // Trigger GitHub Pages deployment (if needed)
  async triggerDeployment() {
    try {
      // GitHub Pages automatically deploys on push to main branch
      // This is just a placeholder for any additional deployment logic
      return { success: true, message: 'Deployment triggered automatically' };
    } catch (error) {
      console.error('Error triggering deployment:', error);
      throw error;
    }
  }
}

export default new GitHubService();