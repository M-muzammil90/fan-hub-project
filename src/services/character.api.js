import { apiFetch } from './api';

export const characterApi = {
  getCharacters: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);

    const queryString = query.toString();
    const endpoint = `/characters${queryString ? `?${queryString}` : ''}`;
    return apiFetch(endpoint, { method: 'GET' });
  },

  getCharacterById: async (id) => {
    return apiFetch(`/characters/${id}`, { method: 'GET' });
  }
};
