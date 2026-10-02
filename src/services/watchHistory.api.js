import { apiFetch } from './api';

export const watchHistoryApi = {
  saveProgress: async ({ seriesId, seasonId, episodeId, progressSeconds, totalDuration }) => {
    return apiFetch('/watch-history', {
      method: 'POST',
      body: JSON.stringify({
        seriesId,
        seasonId,
        episodeId,
        progressSeconds,
        totalDuration
      })
    });
  },

  getContinueWatching: async () => {
    return apiFetch('/watch-history/continue-watching', { method: 'GET' });
  },

  getSeriesWatchProgress: async (seriesId) => {
    return apiFetch(`/watch-history/series/${seriesId}`, { method: 'GET' });
  },

  clearWatchHistory: async () => {
    return apiFetch('/watch-history', { method: 'DELETE' });
  }
};
