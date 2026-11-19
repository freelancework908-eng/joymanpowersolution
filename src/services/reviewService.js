import { apiRequest } from './apiClient';

export const reviewService = {
  /**
   * Get published video reviews for the public website
   */
  async getPublishedReviews(filters = {}) {
    const { country, category } = filters;
    const { data, error } = await apiRequest('/api/public/reviews');
    if (error) return { data: [], error };

    let results = data || [];
    if (country && country !== 'All') {
      results = results.filter((r) => r.country === country);
    }
    if (category && category !== 'All') {
      results = results.filter((r) => r.job_category === category);
    }
    return { data: results, error: null };
  },

  /**
   * Admin: Get all reviews (published, draft, unpublished)
   */
  async getAllReviews() {
    return await apiRequest('/api/admin/reviews');
  },

  /**
   * Admin: Create new video review
   */
  async createReview(reviewData) {
    if (!reviewData.video_url || !reviewData.video_url.trim()) {
      return { data: null, error: new Error('Video URL or upload is required.') };
    }

    return await apiRequest('/api/admin/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  /**
   * Admin: Update video review
   */
  async updateReview(id, reviewData) {
    return await apiRequest(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  },

  /**
   * Admin: Delete video review
   */
  async deleteReview(id) {
    return await apiRequest(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Admin: Toggle publish status ('published', 'draft', 'unpublished')
   */
  async togglePublishStatus(id, newStatus) {
    return await apiRequest(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus }),
    });
  },
};
