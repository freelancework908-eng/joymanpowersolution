import { apiRequest } from './apiClient';

export const bannerService = {
  /**
   * Get single active homepage banner for the public website
   */
  async getActiveBanner() {
    return await apiRequest('/api/public/banner');
  },

  /**
   * Admin: Get all banners
   */
  async getAllBanners() {
    return await apiRequest('/api/admin/banners');
  },

  /**
   * Admin: Create new homepage banner
   */
  async createBanner(bannerData) {
    if (!bannerData.image_url || !bannerData.image_url.trim()) {
      return { data: null, error: new Error('Banner image is required.') };
    }

    return await apiRequest('/api/admin/banners', {
      method: 'POST',
      body: JSON.stringify(bannerData),
    });
  },

  /**
   * Admin: Update homepage banner
   */
  async updateBanner(id, bannerData) {
    return await apiRequest(`/api/admin/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bannerData),
    });
  },

  /**
   * Admin: Delete homepage banner
   */
  async deleteBanner(id) {
    return await apiRequest(`/api/admin/banners/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Admin: Toggle banner active state
   */
  async toggleActive(id, isActive) {
    return await apiRequest(`/api/admin/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: isActive }),
    });
  },
};
