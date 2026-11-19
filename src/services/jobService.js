import { apiRequest } from './apiClient';

export const jobService = {
  /**
   * Get all published jobs for the public website
   */
  async getPublishedJobs(filters = {}) {
    const { country, category, experience, search, limit } = filters;
    const params = new URLSearchParams();

    if (country && country !== 'All') {
      const c = country.includes('UAE') ? 'UAE' : country;
      params.set('country', c);
    }
    if (category && category !== 'All') params.set('category', category);
    if (experience && experience !== 'All') params.set('experience', experience);
    if (search && search.trim()) params.set('search', search.trim());
    if (limit) params.set('limit', limit);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/api/public/jobs${queryStr}`);
  },

  /**
   * Get distinct job categories
   */
  async getCategories() {
    const { data } = await this.getPublishedJobs();
    if (!data) return [
      'Facility Management',
      'Construction & Engineering',
      'Oil & Gas',
      'Hospitality & Catering',
      'Logistics & Transport'
    ];
    const set = new Set(data.map((j) => j.category).filter(Boolean));
    return Array.from(set);
  },

  /**
   * Get single published job details
   */
  async getJobById(id) {
    return await apiRequest(`/api/public/jobs/${id}`);
  },

  /**
   * Admin: Get all jobs (published, draft, closed)
   */
  async getAllJobs(filters = {}) {
    const { status, country, search } = filters;
    const params = new URLSearchParams();

    if (status && status !== 'All') params.set('status', status);
    if (country && country !== 'All') {
      const c = country.includes('UAE') ? 'UAE' : country;
      params.set('country', c);
    }
    if (search && search.trim()) params.set('search', search.trim());

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/api/admin/jobs${queryStr}`);
  },

  /**
   * Admin: Create new job vacancy
   */
  async createJob(jobData) {
    return await apiRequest('/api/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  /**
   * Admin: Update existing job vacancy
   */
  async updateJob(id, jobData) {
    return await apiRequest(`/api/admin/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  },

  /**
   * Admin: Delete job vacancy
   */
  async deleteJob(id) {
    return await apiRequest(`/api/admin/jobs/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Admin: Change job status ('published', 'draft', 'closed')
   */
  async toggleJobStatus(id, newStatus) {
    return await apiRequest(`/api/admin/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
  },
};
