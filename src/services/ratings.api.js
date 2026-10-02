import { apiFetch } from './api';

export const ratingsApi = {
  getMine: () => apiFetch('/ratings'),
  getApprovedForContent: (contentId) => apiFetch(`/ratings/content/${contentId}`),
  submit: ({ content, rating, review }) =>
    apiFetch('/ratings', {
      method: 'POST',
      body: JSON.stringify({ content, rating, review })
    })
};

export const feedbackApi = {
  submit: ({ type, message }) =>
    apiFetch('/feedback', {
      method: 'POST',
      body: JSON.stringify({ type, message })
    })
};
