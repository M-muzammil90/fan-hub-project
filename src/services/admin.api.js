import { apiFetch } from './api';

export const adminApi = {
  // Analytics
  getAnalytics: () => apiFetch('/admin/analytics'),

  // Users Management
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/users${query ? `?${query}` : ''}`);
  },
  getUserById: (id) => apiFetch(`/users/${id}`),
  updateUser: (id, formDataOrJson) => {
    const isFormData = formDataOrJson instanceof FormData;
    return apiFetch(`/users/${id}`, {
      method: 'PUT',
      body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson)
    });
  },
  deleteUser: (id) => apiFetch(`/users/${id}`, { method: 'DELETE' }),

  // Categories Management
  getCategories: () => apiFetch('/categories'),
  getCategoryById: (id) => apiFetch(`/categories/${id}`),
  createCategory: (formDataOrJson) => {
    const isFormData = formDataOrJson instanceof FormData;
    return apiFetch('/categories', {
      method: 'POST',
      body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson)
    });
  },
  updateCategory: (id, formDataOrJson) => {
    const isFormData = formDataOrJson instanceof FormData;
    return apiFetch(`/categories/${id}`, {
      method: 'PUT',
      body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson)
    });
  },
  deleteCategory: (id) => apiFetch(`/categories/${id}`, { method: 'DELETE' }),

  // Characters Management
  getCharacters: () => apiFetch('/characters'),
  getCharacterById: (id) => apiFetch(`/characters/${id}`),
  createCharacter: (formDataOrJson) => {
    const isFormData = formDataOrJson instanceof FormData;
    return apiFetch('/characters', {
      method: 'POST',
      body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson)
    });
  },
  updateCharacter: (id, formDataOrJson) => {
    const isFormData = formDataOrJson instanceof FormData;
    return apiFetch(`/characters/${id}`, {
      method: 'PUT',
      body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson)
    });
  },
  deleteCharacter: (id) => apiFetch(`/characters/${id}`, { method: 'DELETE' }),

  // Content Management
  getContent: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/content${query ? `?${query}` : ''}`);
  },
  getContentById: (id) => apiFetch(`/content/${id}`),
  createContent: (formDataOrJson) => {
    const isFormData = formDataOrJson instanceof FormData;
    return apiFetch('/content', {
      method: 'POST',
      body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson)
    });
  },
  updateContent: (id, formDataOrJson) => {
    const isFormData = formDataOrJson instanceof FormData;
    return apiFetch(`/content/${id}`, {
      method: 'PUT',
      body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson)
    });
  },
  deleteContent: (id) => apiFetch(`/content/${id}`, { method: 'DELETE' }),

  // Events Management
  getEvents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/events${query ? `?${query}` : ''}`);
  },
  getEventById: (id) => apiFetch(`/events/${id}`),
  createEvent: (formDataOrJson) => {
    const isFormData = formDataOrJson instanceof FormData;
    return apiFetch('/events', {
      method: 'POST',
      body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson)
    });
  },
  updateEvent: (id, formDataOrJson) => {
    const isFormData = formDataOrJson instanceof FormData;
    return apiFetch(`/events/${id}`, {
      method: 'PUT',
      body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson)
    });
  },
  deleteEvent: (id) => apiFetch(`/events/${id}`, { method: 'DELETE' }),
  togglePublishEvent: (id, isPublished) => apiFetch(`/events/${id}/publish`, {
    method: 'PATCH',
    body: JSON.stringify({ isPublished })
  }),
  toggleFeatureEvent: (id, isFeatured) => apiFetch(`/events/${id}/feature`, {
    method: 'PATCH',
    body: JSON.stringify({ isFeatured })
  }),

  // Event Bookings Admin Management
  getBookings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/bookings/admin/all${query ? `?${query}` : ''}`);
  },
  updateBookingStatus: (id, status) => {
    return apiFetch(`/bookings/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Merchandise Management
  getMerchandise: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/merchandise${query ? `?${query}` : ''}`);
  },
  getMerchandiseById: (id) => apiFetch(`/merchandise/${id}`),
  createMerchandise: (formDataOrJson) => {
    const isFormData = formDataOrJson instanceof FormData;
    return apiFetch('/merchandise', {
      method: 'POST',
      body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson)
    });
  },
  updateMerchandise: (id, formDataOrJson) => {
    const isFormData = formDataOrJson instanceof FormData;
    return apiFetch(`/merchandise/${id}`, {
      method: 'PUT',
      body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson)
    });
  },
  deleteMerchandise: (id) => apiFetch(`/merchandise/${id}`, { method: 'DELETE' }),

  // Fan Submissions Moderation
  getAdminSubmissions: (status) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiFetch(`/admin/fan-submissions${query}`);
  },
  getAdminSubmissionById: (id) => apiFetch(`/admin/fan-submissions/${id}`),
  updateAdminSubmission: (id, data) => apiFetch(`/admin/fan-submissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteAdminSubmission: (id) => apiFetch(`/admin/fan-submissions/${id}`, { method: 'DELETE' }),

  // Feedback Management
  getAdminFeedback: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/admin/feedback${query ? `?${query}` : ''}`);
  },
  getAdminFeedbackById: (id) => apiFetch(`/admin/feedback/${id}`),
  updateAdminFeedback: (id, data) => apiFetch(`/admin/feedback/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteAdminFeedback: (id) => apiFetch(`/admin/feedback/${id}`, { method: 'DELETE' }),

  // Reviews & Community Ratings Moderation
  getAdminReviews: (status) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiFetch(`/admin/reviews${query}`);
  },
  moderateReview: (id, status) => {
    return apiFetch(`/admin/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Standalone Media Library Uploads
  uploadMedia: (file, folder = 'fan-hub-plus/general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return apiFetch('/media/upload', {
      method: 'POST',
      body: formData
    });
  },
  uploadMultipleMedia: (files, folder = 'fan-hub-plus/general') => {
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('files', f));
    formData.append('folder', folder);
    return apiFetch('/media/upload-multiple', {
      method: 'POST',
      body: formData
    });
  },
  deleteMedia: (publicId, resourceType = 'image') => {
    return apiFetch(`/media?publicId=${encodeURIComponent(publicId)}&resourceType=${encodeURIComponent(resourceType)}`, {
      method: 'DELETE'
    });
  }
};
