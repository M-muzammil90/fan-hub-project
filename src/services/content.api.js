import { apiFetch } from './api';

export const contentApi = {
  getContent: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.contentType) query.append('contentType', params.contentType);
    if (params.genre) query.append('genre', params.genre);
    if (params.year) query.append('year', params.year);
    if (params.search) query.append('search', params.search);
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const queryString = query.toString();
    const endpoint = `/content${queryString ? `?${queryString}` : ''}`;
    return apiFetch(endpoint, { method: 'GET' });
  },

  getContentById: async (id) => {
    return apiFetch(`/content/${id}`, { method: 'GET' });
  },

  getUpcoming: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.limit) query.append('limit', params.limit);
    const queryString = query.toString();
    const endpoint = `/content/upcoming${queryString ? `?${queryString}` : ''}`;
    return apiFetch(endpoint, { method: 'GET' });
  }
};

