import { apiRequest, getAuthToken } from './apiClient';

export const applicationService = {
  /**
   * Submit candidate application with resume file stored in Backblaze B2
   */
  async submitApplication({
    job_id,
    job_title,
    candidate_name,
    mobile,
    email,
    experience,
    current_location,
    resumeFile
  }) {
    // 1. Mandatory Validations
    if (!candidate_name || candidate_name.trim().length < 2) {
      return { error: new Error('Candidate full name is required.') };
    }
    if (!mobile || !/^[0-9+\s-]{8,18}$/.test(mobile.trim())) {
      return { error: new Error('Please enter a valid mobile number with at least 10 digits.') };
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return { error: new Error('Please enter a valid email address.') };
    }
    if (!experience || experience.trim().length === 0) {
      return { error: new Error('Total experience is required.') };
    }
    if (!current_location || current_location.trim().length === 0) {
      return { error: new Error('Current location is required.') };
    }
    if (!resumeFile) {
      return { error: new Error('Please upload your resume file (PDF, DOC, DOCX).') };
    }

    // File validation: PDF, DOC, DOCX only, max 10MB
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const fileExt = resumeFile.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      return { error: new Error('Invalid file format. Only PDF, DOC, and DOCX files are allowed.') };
    }
    if (resumeFile.size > 10 * 1024 * 1024) {
      return { error: new Error('File size exceeds the 10MB limit. Please upload a smaller file.') };
    }

    // Build FormData for multipart upload
    const formData = new FormData();
    formData.append('job_id', job_id || '');
    formData.append('job_title', job_title || '');
    formData.append('candidate_name', candidate_name.trim());
    formData.append('mobile', mobile.trim());
    formData.append('email', email.trim());
    formData.append('experience', experience.trim());
    formData.append('current_location', current_location.trim());
    formData.append('resume', resumeFile);

    const { data, error } = await apiRequest('/api/public/apply', {
      method: 'POST',
      body: formData,
    });

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  },

  /**
   * Admin: Get all candidate applications
   */
  async getAllApplications(filters = {}) {
    const { status, search } = filters;
    const params = new URLSearchParams();
    if (status && status !== 'All') params.set('status', status);
    if (search && search.trim()) params.set('search', search.trim());

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/api/admin/applications${queryStr}`);
  },

  /**
   * Admin: Update application status ('pending', 'shortlisted', 'rejected', 'selected')
   */
  async updateApplicationStatus(id, newStatus) {
    return await apiRequest(`/api/admin/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
  },

  /**
   * Admin: Delete application
   */
  async deleteApplication(id) {
    return await apiRequest(`/api/admin/applications/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Admin: Download resume securely
   */
  async downloadResume(id, candidateName = 'Candidate') {
    const token = getAuthToken();
    try {
      const res = await fetch(`/api/admin/applications/${id}/resume`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to download resume. Please ensure you are authenticated.');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanName = candidateName.replace(/[^a-zA-Z0-9_-]/g, '_');
      a.download = `Resume_${cleanName}_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return { success: true, error: null };
    } catch (err) {
      console.error('[Download Resume Error]:', err);
      return { success: false, error: err };
    }
  }
};
