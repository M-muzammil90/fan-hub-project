import { apiFetch } from './api';

export const eventApi = {
  // Get all filterable events
  getEvents: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.city && params.city !== 'all') query.append('city', params.city);
    if (params.type && params.type !== 'all') query.append('type', params.type);
    if (params.eventType && params.eventType !== 'all') query.append('eventType', params.eventType);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    if (params.isFeatured !== undefined) query.append('isFeatured', params.isFeatured);
    if (params.sort) query.append('sort', params.sort);
    if (params.limit) query.append('limit', params.limit);
    if (params.page) query.append('page', params.page);

    const queryString = query.toString();
    const endpoint = `/events${queryString ? `?${queryString}` : ''}`;
    return apiFetch(endpoint, { method: 'GET' });
  },

  // Get single event by slug or ID
  getEventBySlug: async (slugOrId) => {
    return apiFetch(`/events/${encodeURIComponent(slugOrId)}`, { method: 'GET' });
  },

  getEventById: async (id) => {
    return apiFetch(`/events/${encodeURIComponent(id)}`, { method: 'GET' });
  },

  // Priority upcoming events
  getUpcomingEvents: async (limit = 10) => {
    return apiFetch(`/events/upcoming?limit=${limit}`, { method: 'GET' });
  },

  // Featured events for banners / highlights
  getFeaturedEvents: async (limit = 5) => {
    return apiFetch(`/events/featured?limit=${limit}`, { method: 'GET' });
  },

  // Location-aware nearby events with coordinates
  getNearbyEvents: async (lat, lng, radius = 200) => {
    return apiFetch(`/events/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, { method: 'GET' });
  },

  // Calendar query
  getCalendarEvents: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.month) query.append('month', params.month);
    if (params.year) query.append('year', params.year);
    if (params.city && params.city !== 'all') query.append('city', params.city);

    const queryString = query.toString();
    return apiFetch(`/events/calendar${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  // Bookings API
  createBooking: async (eventId, bookingData) => {
    return apiFetch(`/events/${encodeURIComponent(eventId)}/bookings`, {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },

  getMyBookings: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.email) query.append('email', params.email);
    if (params.reference) query.append('reference', params.reference);
    if (params.references) query.append('references', params.references);
    const queryString = query.toString();
    return apiFetch(`/bookings/my${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  getBookingByReference: async (reference) => {
    return apiFetch(`/bookings/reference/${encodeURIComponent(reference)}`, { method: 'GET' });
  },

  getBookingById: async (id) => {
    return apiFetch(`/bookings/${encodeURIComponent(id)}`, { method: 'GET' });
  },

  cancelBooking: async (id) => {
    return apiFetch(`/bookings/${encodeURIComponent(id)}/cancel`, { method: 'PATCH' });
  },

  getEventBookings: async (eventId) => {
    return apiFetch(`/events/${encodeURIComponent(eventId)}/bookings`, { method: 'GET' });
  }
};
