import { apiFetch } from './api';

export const authApi = {
  login: async (email, password) => {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async ({ name, email, password }) => {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },

  getMe: async () => {
    return apiFetch('/auth/me', {
      method: 'GET'
    });
  },

  forgotPassword: async (email) => {
    return apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  resetPassword: async (token, password) => {
    return apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    });
  }
};
