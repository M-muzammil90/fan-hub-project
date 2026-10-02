import { apiFetch } from './api';

export const seriesApi = {
  // === SERIES ===
  getSeries: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.genre) query.append('genre', params.genre);
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.isFeatured !== undefined) query.append('isFeatured', params.isFeatured);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    const endpoint = `/series${queryString ? `?${queryString}` : ''}`;
    return apiFetch(endpoint, { method: 'GET' });
  },

  getFeaturedSeries: async () => {
    return apiFetch('/series/featured', { method: 'GET' });
  },

  getSeriesByIdOrSlug: async (idOrSlug) => {
    return apiFetch(`/series/${idOrSlug}`, { method: 'GET' });
  },

  createSeries: async (data) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiFetch('/series', {
      method: 'POST',
      body
    });
  },

  updateSeries: async (id, data) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiFetch(`/series/${id}`, {
      method: 'PUT',
      body
    });
  },

  deleteSeries: async (id) => {
    return apiFetch(`/series/${id}`, {
      method: 'DELETE'
    });
  },

  // === SEASONS ===
  getSeasonsBySeries: async (seriesId) => {
    return apiFetch(`/seasons/series/${seriesId}`, { method: 'GET' });
  },

  getSeasonById: async (id) => {
    return apiFetch(`/seasons/${id}`, { method: 'GET' });
  },

  createSeason: async (data) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiFetch('/seasons', {
      method: 'POST',
      body
    });
  },

  updateSeason: async (id, data) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiFetch(`/seasons/${id}`, {
      method: 'PUT',
      body
    });
  },

  deleteSeason: async (id) => {
    return apiFetch(`/seasons/${id}`, {
      method: 'DELETE'
    });
  },

  // === EPISODES ===
  getEpisodesBySeason: async (seasonId) => {
    return apiFetch(`/episodes/season/${seasonId}`, { method: 'GET' });
  },

  getEpisodeById: async (id) => {
    return apiFetch(`/episodes/${id}`, { method: 'GET' });
  },

  createEpisode: async (data) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiFetch('/episodes', {
      method: 'POST',
      body
    });
  },

  updateEpisode: async (id, data) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiFetch(`/episodes/${id}`, {
      method: 'PUT',
      body
    });
  },

  deleteEpisode: async (id) => {
    return apiFetch(`/episodes/${id}`, {
      method: 'DELETE'
    });
  }
};
