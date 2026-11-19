import { apiRequest } from './apiClient';

export const settingsService = {
  /**
   * Get current company settings from TiDB
   */
  async getSettings() {
    return await apiRequest('/api/public/settings');
  },

  /**
   * Admin: Update company settings in TiDB
   */
  async updateSettings(updates) {
    return await apiRequest('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};
