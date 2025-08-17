/**
 * Content API - Centralized content management
 * 
 * This module provides a unified interface for all content operations,
 * abstracting the underlying storage mechanism (GitHub, local files, CMS, etc.)
 */

class ContentAPI {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || '/api';
    this.contentPath = '/content';
    this.githubToken = null;
  }

  /**
   * Initialize the API with authentication
   */
  async init(token = null) {
    if (token) {
      this.githubToken = token;
    }
    return this.checkConnection();
  }

  /**
   * Check API connection and authentication
   */
  async checkConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.warn('API health check failed, falling back to static content');
      return false;
    }
  }

  /**
   * Get content by type and slug
   */
  async getContent(type, slug = null) {
    const path = slug ? `${type}/${slug}` : type;
    
    try {
      // Try API first
      const response = await fetch(`${this.baseUrl}/content/${path}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`API fetch failed for ${path}, trying static content`);
    }

    // Fallback to static JSON/Markdown files
    return this.getStaticContent(type, slug);
  }

  /**
   * Get static content from public files
   */
  async getStaticContent(type, slug) {
    const path = slug 
      ? `/content/${type}/${slug}.json`
      : `/content/${type}.json`;
    
    try {
      const response = await fetch(path);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error(`Failed to load static content: ${path}`, error);
    }
    
    return null;
  }

  /**
   * Save content
   */
  async saveContent(type, slug, data) {
    const path = slug ? `${type}/${slug}` : type;
    
    try {
      const response = await fetch(`${this.baseUrl}/content/${path}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.githubToken ? `Bearer ${this.githubToken}` : ''
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to save content: ${path}`, error);
      throw error;
    }
  }

  /**
   * Delete content
   */
  async deleteContent(type, slug) {
    const path = `${type}/${slug}`;
    
    try {
      const response = await fetch(`${this.baseUrl}/content/${path}`, {
        method: 'DELETE',
        headers: {
          'Authorization': this.githubToken ? `Bearer ${this.githubToken}` : ''
        }
      });

      return response.ok;
    } catch (error) {
      console.error(`Failed to delete content: ${path}`, error);
      return false;
    }
  }

  /**
   * List content by type
   */
  async listContent(type, options = {}) {
    const { limit = 10, offset = 0, sort = 'date', order = 'desc' } = options;
    const params = new URLSearchParams({ limit, offset, sort, order });
    
    try {
      const response = await fetch(`${this.baseUrl}/content/${type}?${params}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Failed to list ${type}, trying static content`);
    }

    // Fallback to static content listing
    return this.listStaticContent(type);
  }

  /**
   * List static content files
   */
  async listStaticContent(type) {
    try {
      const response = await fetch(`/content/${type}/index.json`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error(`Failed to list static content: ${type}`, error);
    }
    
    return [];
  }

  /**
   * Search content
   */
  async searchContent(query, types = []) {
    const params = new URLSearchParams({ 
      q: query,
      types: types.join(',')
    });
    
    try {
      const response = await fetch(`${this.baseUrl}/content/search?${params}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Search failed', error);
    }
    
    return [];
  }

  /**
   * Upload media file
   */
  async uploadMedia(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${this.baseUrl}/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': this.githubToken ? `Bearer ${this.githubToken}` : ''
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Media upload failed', error);
      throw error;
    }
  }

  /**
   * Get media library
   */
  async getMediaLibrary(options = {}) {
    const { limit = 20, offset = 0 } = options;
    const params = new URLSearchParams({ limit, offset });
    
    try {
      const response = await fetch(`${this.baseUrl}/media?${params}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to load media library', error);
    }
    
    return [];
  }
}

// Export singleton instance
export default new ContentAPI();

// Export class for testing
export { ContentAPI };