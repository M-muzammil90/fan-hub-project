import { apiFetch } from './api';

export const merchandiseApi = {
  getMerchandise: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.isUpcoming !== undefined) query.append('isUpcoming', params.isUpcoming);

    const queryString = query.toString();
    const endpoint = `/merchandise${queryString ? `?${queryString}` : ''}`;
    return apiFetch(endpoint, { method: 'GET' });
  },

  getMerchandiseById: async (id) => {
    return apiFetch(`/merchandise/${id}`, { method: 'GET' });
  }
};
