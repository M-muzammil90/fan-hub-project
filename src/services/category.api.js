import { apiFetch } from './api';

export const categoryApi = {
  getCategories: async () => {
    return await apiFetch('/categories', { method: 'GET' });
  },

  getCategoryById: async (id) => {
    return await apiFetch(`/categories/${id}`, { method: 'GET' });
  }
};

