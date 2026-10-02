const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Standard fetch wrapper supporting JSON & FormData with JWT Authorization
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('fanhub_token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Do not set Content-Type header if sending FormData (browser sets boundary automatically)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);

    const isPublicAuth =
      endpoint.startsWith('/auth/login') ||
      endpoint.startsWith('/auth/register') ||
      endpoint.startsWith('/auth/forgot-password') ||
      endpoint.startsWith('/auth/reset-password');

    if (response.status === 401 && !isPublicAuth) {
      localStorage.removeItem('fanhub_token');
      localStorage.removeItem('fanhub_user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login?expired=true';
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}
