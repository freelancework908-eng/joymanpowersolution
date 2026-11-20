import { apiRequest } from './apiClient';
import { initialJobs } from '../data/initialJobs';

export const ALL_DEFAULT_CATEGORIES = [
  'Mason - Block/Plaster',
  'Tile Mason',
  'Steel Fixer',
  'Shuttering Carpenter',
  'Scaffolder',
  'Driver',
  'Engineer',
  'Pocket Packer',
  'Facility Management',
  'Construction & Engineering',
  'Oil & Gas',
  'Hospitality & Catering',
  'Logistics & Transport'
];

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
    const res = await apiRequest(`/api/public/jobs${queryStr}`);

    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res;
    }

    // Defensive fallback: If database is unreachable or empty, return filtered initialJobs
    let filtered = [...initialJobs];
    if (country && country !== 'All') {
      const c = country.includes('UAE') ? 'UAE' : country;
      filtered = filtered.filter((j) => j.country === c);
    }
    if (category && category !== 'All') {
      filtered = filtered.filter((j) => j.category === category);
    }
    if (experience && experience !== 'All') {
      filtered = filtered.filter((j) => j.experience && j.experience.includes(experience));
    }
    if (search && search.trim()) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title?.toLowerCase().includes(s) ||
          j.description?.toLowerCase().includes(s) ||
          j.location?.toLowerCase().includes(s) ||
          j.category?.toLowerCase().includes(s)
      );
    }
    if (limit && Number(limit) > 0) {
      filtered = filtered.slice(0, Number(limit));
    }

    return { data: filtered, error: res.error, isFallback: true };
  },

  /**
   * Get distinct job categories (all 8 required + active)
   */
  async getCategories() {
    try {
      const res = await apiRequest('/api/public/categories');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // ignore
    }
    return ALL_DEFAULT_CATEGORIES;
  },

  /**
   * Admin: Get all categories
   */
  async getAdminCategories() {
    return await apiRequest('/api/admin/categories');
  },

  /**
   * Admin: Add new category
   */
  async createCategory(catData) {
    return await apiRequest('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(catData),
    });
  },

  /**
   * Admin: Delete category
   */
  async deleteCategory(id) {
    return await apiRequest(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get single published job details
   */
  async getJobById(id) {
    const res = await apiRequest(`/api/public/jobs/${id}`);
    if (res.data) return res;

    // Fallback lookup in initialJobs
    const fallback = initialJobs.find((j) => String(j.id) === String(id));
    if (fallback) {
      return { data: fallback, error: null, isFallback: true };
    }
    return res;
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
    const res = await apiRequest(`/api/admin/jobs${queryStr}`);
    if (res.data && Array.isArray(res.data)) {
      return res;
    }
    return { data: initialJobs, error: res.error, isFallback: true };
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

  async updateJobStatus(id, newStatus) {
    return this.toggleJobStatus(id, newStatus);
  }
};
