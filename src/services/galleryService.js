import { apiRequest } from './apiClient';

export const galleryService = {
  /**
   * Get all published gallery items for the public website
   */
  async getPublishedGallery(category = 'All') {
    const { data, error } = await apiRequest('/api/public/gallery');
    if (error) return { data: [], error };

    let results = data || [];
    if (category && category !== 'All') {
      results = results.filter((g) => g.category === category);
    }
    return { data: results, error: null };
  },

  /**
   * Get all gallery items (supports category filter)
   */
  async getAllGallery(category = 'All') {
    const { data, error } = await apiRequest('/api/public/gallery');
    if (error) return { data: [], error };

    let results = data || [];
    if (category && category !== 'All') {
      results = results.filter((g) => g.category === category);
    }
    return { data: results, error: null };
  },

  /**
   * Admin: Get all gallery items including drafts
   */
  async getAdminGallery() {
    return await apiRequest('/api/admin/gallery');
  },

  /**
   * Admin: Add new gallery item
   */
  async createGalleryItem(itemData) {
    if (!itemData.title || !itemData.image_url) {
      return { data: null, error: new Error('Title and Image are required.') };
    }

    return await apiRequest('/api/admin/gallery', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  /**
   * Admin: Update gallery item
   */
  async updateGalleryItem(id, itemData) {
    return await apiRequest(`/api/admin/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  },

  /**
   * Admin: Delete gallery item
   */
  async deleteGalleryItem(id) {
    return await apiRequest(`/api/admin/gallery/${id}`, {
      method: 'DELETE',
    });
  },
};
