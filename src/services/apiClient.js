/**
 * Joy Manpower Solution - Central API Client
 * Automatically attaches Admin JWT token from localStorage
 */
export const getAuthToken = () => {
  return localStorage.getItem('jms_admin_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('jms_admin_token', token);
  } else {
    localStorage.removeItem('jms_admin_token');
  }
};

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const headers = { ...options.headers };

  // Attach token if available
  const token = getAuthToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Do not set Content-Type for FormData (multipart/form-data)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data?.error || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return { data: data.data !== undefined ? data.data : data, error: null };
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err.message);
    return { data: null, error: err };
  }
}
