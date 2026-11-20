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
    const contentType = res.headers.get('content-type') || '';

    // If server returned HTML instead of expected JSON (e.g. Vercel SPA index.html fallback)
    if (contentType.includes('text/html') || !res.ok) {
      const text = await res.text().catch(() => '');
      if (text.trim().startsWith('<') || !res.ok) {
        const errorMsg = res.ok
          ? `Expected JSON API response but received HTML from ${endpoint}.`
          : `Request to ${endpoint} failed with status ${res.status}`;
        const error = new Error(errorMsg);
        error.status = res.status;
        return { data: null, error };
      }
      try {
        const parsed = JSON.parse(text);
        return { data: parsed.data !== undefined ? parsed.data : parsed, error: null };
      } catch {
        return { data: null, error: new Error(`Invalid JSON received from ${endpoint}`) };
      }
    }

    const data = await res.json().catch(() => null);

    if (!data) {
      return { data: null, error: new Error(`Empty or invalid response from ${endpoint}`) };
    }

    return { data: data.data !== undefined ? data.data : data, error: null };
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err.message);
    return { data: null, error: err };
  }
}
