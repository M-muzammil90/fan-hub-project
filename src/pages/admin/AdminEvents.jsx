import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon,
  MapPin,
  Clock,
  ExternalLink,
  Eye,
  CheckCircle2,
  XCircle,
  Star,
  Globe,
  Tag,
  ShieldAlert,
  Ticket,
  Flame,
  User,
  Mail,
  Phone,
  Filter
} from 'lucide-react';
import { adminApi } from '../../services/admin.api';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import { CITIES_LIST, EVENT_TYPES_LIST, STATUS_LIST } from '../../components/events/EventFilters';
import EventStatusBadge from '../../components/events/EventStatusBadge';
import EventTypeBadge from '../../components/events/EventTypeBadge';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCityFilter, setSelectedCityFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [eventType, setEventType] = useState('Convention');
  const [city, setCity] = useState('Karachi');
  const [venue, setVenue] = useState('Karachi Expo Center');
  const [address, setAddress] = useState('University Road, Karachi');
  const [latitude, setLatitude] = useState('24.8988');
  const [longitude, setLongitude] = useState('67.0782');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('06:00 PM');
  const [endTime, setEndTime] = useState('10:00 PM');
  const [organizer, setOrganizer] = useState('FanHub Community');
  const [ticketUrl, setTicketUrl] = useState('');
  const [ticketPrice, setTicketPrice] = useState('1500');
  const [totalTickets, setTotalTickets] = useState('100');
  const [availableTickets, setAvailableTickets] = useState('100');
  const [status, setStatus] = useState('Upcoming');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // Image Upload
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Admin Bookings Viewer State
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [selectedEventForBookings, setSelectedEventForBookings] = useState(null);
  const [bookingsList, setBookingsList] = useState([]);
  const [isBookingsLoading, setIsBookingsLoading] = useState(false);
  const [bookingsSearch, setBookingsSearch] = useState('');
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [eventRes, catRes] = await Promise.all([
        adminApi.getEvents({ includeUnpublished: 'true' }),
        adminApi.getCategories()
      ]);

      if (eventRes.success) {
        setEvents(eventRes.events || []);
      }
      if (catRes.success) {
        const cats = catRes.categories || [];
        setCategories(cats);
        if (cats.length > 0 && !categoryId) {
          setCategoryId(cats[0]._id || cats[0].id);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch scheduled events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setSlug('');
    setDescription('');
    if (categories.length > 0) {
      setCategoryId(categories[0]._id || categories[0].id);
    }
    setEventType('Convention');
    setCity('Karachi');
    setVenue('Karachi Expo Center');
    setAddress('University Road, Karachi');
    setLatitude('24.8988');
    setLongitude('67.0782');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setStartTime('06:00 PM');
    setEndTime('10:00 PM');
    setOrganizer('FanHub Community');
    setTicketUrl('');
    setTicketPrice('1500');
    setTotalTickets('100');
    setAvailableTickets('100');
    setStatus('Upcoming');
    setIsFeatured(false);
    setIsPublished(true);
    setImage('');
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingItem(evt);
    setTitle(evt.title || '');
    setSlug(evt.slug || '');
    setDescription(evt.description || '');
    setCategoryId(evt.category?._id || evt.category || (categories[0]?._id || ''));
    setEventType(evt.eventType || 'Convention');
    setCity(evt.city || 'Karachi');
    setVenue(evt.venue || '');
    setAddress(evt.address || '');
    setLatitude(evt.latitude !== undefined && evt.latitude !== null ? String(evt.latitude) : '');
    setLongitude(evt.longitude !== undefined && evt.longitude !== null ? String(evt.longitude) : '');
    setStartDate(evt.startDate ? new Date(evt.startDate).toISOString().split('T')[0] : '');
    setEndDate(evt.endDate ? new Date(evt.endDate).toISOString().split('T')[0] : '');
    setStartTime(evt.startTime || '06:00 PM');
    setEndTime(evt.endTime || '10:00 PM');
    setOrganizer(evt.organizer || 'FanHub Community');
    setTicketUrl(evt.ticketUrl || '');
    setTicketPrice(evt.ticketPrice !== undefined ? String(evt.ticketPrice) : '1500');
    setTotalTickets(evt.totalTickets !== undefined ? String(evt.totalTickets) : '100');
    setAvailableTickets(evt.availableTickets !== undefined ? String(evt.availableTickets) : '100');
    setStatus(evt.status || 'Upcoming');
    setIsFeatured(!!evt.isFeatured);
    setIsPublished(evt.isPublished !== undefined ? !!evt.isPublished : true);
    setImage(evt.image || evt.coverImage || '');
    setImageFile(null);
    setImagePreview(evt.image || evt.coverImage || '');
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append(
        'slug',
        slug.trim() || title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
      );
      formData.append('description', description.trim());
      formData.append('category', categoryId);
      formData.append('eventType', eventType);
      formData.append('city', city.trim());
      formData.append('venue', venue.trim());
      formData.append('address', address.trim());
      if (latitude) formData.append('latitude', latitude);
      if (longitude) formData.append('longitude', longitude);
      formData.append('startDate', startDate);
      if (endDate) formData.append('endDate', endDate);
      formData.append('startTime', startTime);
      formData.append('endTime', endTime);
      formData.append('organizer', organizer);
      formData.append('ticketUrl', ticketUrl);
      formData.append('ticketPrice', ticketPrice);
      formData.append('totalTickets', totalTickets);
      formData.append('availableTickets', availableTickets);
      formData.append('status', status);
      formData.append('isFeatured', isFeatured);
      formData.append('isPublished', isPublished);

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (image) {
        formData.append('image', image);
      }

      let res;
      if (editingItem) {
        const eId = editingItem._id || editingItem.id;
        res = await adminApi.updateEvent(eId, formData);
      } else {
        res = await adminApi.createEvent(formData);
      }

      if (res.success) {
        fetchData();
        setIsModalOpen(false);
      } else {
        alert(res.message || 'Failed to save event');
      }
    } catch (err) {
      alert(err.message || 'Failed to save event schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (evt) => {
    const eId = evt._id || evt.id;
    try {
      const res = await adminApi.togglePublishEvent(eId, !evt.isPublished);
      if (res.success) {
        setEvents((prev) =>
          prev.map((e) => ((e._id || e.id) === eId ? { ...e, isPublished: !e.isPublished } : e))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle publish state');
    }
  };

  const handleToggleFeature = async (evt) => {
    const eId = evt._id || evt.id;
    try {
      const res = await adminApi.toggleFeatureEvent(eId, !evt.isFeatured);
      if (res.success) {
        setEvents((prev) =>
          prev.map((e) => ((e._id || e.id) === eId ? { ...e, isFeatured: !e.isFeatured } : e))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle featured state');
    }
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;
    const eId = selectedEvent._id || selectedEvent.id;
    setIsDeleting(true);
    try {
      await adminApi.deleteEvent(eId);
      setEvents((prev) => prev.filter((evt) => (evt._id || evt.id) !== eId));
      setDeleteModalOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      alert(err.message || 'Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Bookings Viewer for a specific event or all events
  const handleOpenBookings = async (evt = null) => {
    setSelectedEventForBookings(evt);
    setIsBookingsModalOpen(true);
    setIsBookingsLoading(true);
    setBookingsSearch('');

    try {
      const params = {};
      if (evt) {
        params.eventId = evt._id || evt.id;
      }
      const res = await adminApi.getBookings(params);
      if (res.success) {
        setBookingsList(res.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsBookingsLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    setUpdatingBookingId(bookingId);
    try {
      const res = await adminApi.updateBookingStatus(bookingId, newStatus);
      if (res.success) {
        setBookingsList((prev) =>
          prev.map((b) =>
            (b._id || b.id) === bookingId ? { ...b, bookingStatus: newStatus } : b
          )
        );
        fetchData(); // Refresh event availability
      } else {
        alert(res.message || 'Failed to update status');
      }
    } catch (err) {
      alert(err.message || 'Error updating status');
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const filteredEvents = events.filter((evt) => {
    const catName = evt.category?.name || '';
    const matchesSearch =
      (evt.title || '').toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      (evt.city || '').toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      (evt.venue || '').toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      (evt.organizer || '').toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      catName.toLowerCase().includes(searchTerm.toLowerCase().trim());

    const matchesCat =
      selectedCategory === 'all' || (evt.category?._id || evt.category) === selectedCategory;

    const matchesCity =
      selectedCityFilter === 'all' || evt.city?.toLowerCase() === selectedCityFilter.toLowerCase();

    const matchesStatus =
      selectedStatusFilter === 'all' || evt.status?.toLowerCase() === selectedStatusFilter.toLowerCase();

    return matchesSearch && matchesCat && matchesCity && matchesStatus;
  });

  const filteredBookings = bookingsList.filter((b) => {
    if (!bookingsSearch.trim()) return true;
    const term = bookingsSearch.toLowerCase().trim();
    return (
      (b.bookingReference || '').toLowerCase().includes(term) ||
      (b.customerName || '').toLowerCase().includes(term) ||
      (b.email || '').toLowerCase().includes(term) ||
      (b.phone || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">Events & Bookings</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure conventions, ticket pricing, availability, and inspect attendee bookings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleOpenBookings(null)}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-200 hover:text-white flex items-center gap-2 transition-all shadow-sm"
          >
            <Ticket className="w-4 h-4 text-red-500" />
            <span>All Bookings</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-xs font-black text-white flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white/[0.02] p-4 rounded-2xl border border-white/10">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-10 pr-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-bold"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c._id || c.id} value={c._id || c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedCityFilter}
          onChange={(e) => setSelectedCityFilter(e.target.value)}
          className="px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-bold"
        >
          {CITIES_LIST.map((cityOption) => (
            <option key={cityOption} value={cityOption === 'All Cities' ? 'all' : cityOption}>
              {cityOption}
            </option>
          ))}
        </select>

        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-bold"
        >
          {STATUS_LIST.map((st) => (
            <option key={st} value={st === 'All Statuses' ? 'all' : st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Events Table View */}
      <div className="rounded-3xl border border-white/10 bg-[#0a0507] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/[0.04] text-zinc-400 font-black uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5">Event</th>
                <th className="px-4 py-3.5">Date & Venue</th>
                <th className="px-4 py-3.5">Tickets & Price</th>
                <th className="px-3 py-3.5 text-center">Status</th>
                <th className="px-3 py-3.5 text-center">Featured</th>
                <th className="px-3 py-3.5 text-center">Published</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-400 font-bold">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-red-500 mb-2" />
                    Loading scheduled events...
                  </td>
                </tr>
              )}

              {!isLoading && filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500 font-medium">
                    No scheduled events found matching current filters.
                  </td>
                </tr>
              )}

              {!isLoading &&
                filteredEvents.map((evt) => {
                  const eId = evt._id || evt.id;
                  const dateStr = evt.startDate
                    ? new Date(evt.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'TBA';
                  const priceVal = evt.ticketPrice !== undefined ? evt.ticketPrice : 1500;
                  const avail = evt.availableTickets !== undefined ? evt.availableTickets : 100;
                  const total = evt.totalTickets || 100;

                  return (
                    <tr key={eId} className="hover:bg-white/[0.02] transition-colors">
                      {/* Event Banner + Title */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={evt.image || evt.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200'}
                            alt={evt.title}
                            className="w-14 h-10 rounded-xl object-cover bg-zinc-950 border border-white/10 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-black text-white truncate max-w-[200px] text-xs sm:text-sm font-display">
                              {evt.title}
                            </h4>
                            <span className="text-[10px] text-red-400 font-bold">
                              {evt.category?.name || 'Fandom'} • {evt.eventType || 'Convention'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date & Location */}
                      <td className="px-4 py-4 space-y-0.5">
                        <div className="font-mono text-zinc-200 font-semibold">{dateStr}</div>
                        <div className="text-[11px] text-zinc-400 truncate max-w-[170px]">
                          {evt.venue ? `${evt.venue}, ` : ''}{evt.city}
                        </div>
                      </td>

                      {/* Tickets & Pricing */}
                      <td className="px-4 py-4 space-y-0.5">
                        <div className="font-mono font-black text-red-400">
                          PKR {priceVal.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          {avail} / {total} passes left
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-4 text-center">
                        <EventStatusBadge status={evt.status || 'Upcoming'} />
                      </td>

                      {/* Featured Toggle */}
                      <td className="px-3 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeature(evt)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            evt.isFeatured
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                              : 'bg-white/5 text-zinc-600 border-white/10 hover:text-zinc-400'
                          }`}
                          title="Toggle Showcase Feature"
                        >
                          <Star className={`w-3.5 h-3.5 ${evt.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                      </td>

                      {/* Published Toggle */}
                      <td className="px-3 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(evt)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${
                            evt.isPublished
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                          }`}
                        >
                          {evt.isPublished ? 'Live' : 'Hidden'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Bookings Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenBookings(evt)}
                            className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 transition-all"
                            title="View Event Bookings"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(evt)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                            title="Edit Event"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEvent(evt);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-400 hover:text-red-200 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Fandom Event' : 'Schedule New Fandom Event'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Demon Slayer Season 4 Convention"
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                URL Slug (Optional, auto-generated)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="demon-slayer-s4-convention"
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs font-mono text-zinc-300 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Category & Event Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-bold"
              >
                {categories.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-bold"
              >
                {EVENT_TYPES_LIST.filter((t) => t !== 'All Types').map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* City & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Karachi"
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Venue Name *
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Karachi Expo Center"
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Venue Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. University Road, Gulshan-e-Iqbal, Karachi"
              className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Ticket Pricing & Inventory Management Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-red-600/10 border border-red-500/20">
            <div>
              <label className="block text-xs font-bold text-red-300 mb-1">
                Ticket Price (PKR) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                placeholder="1500"
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-red-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-red-300 mb-1">
                Total Tickets *
              </label>
              <input
                type="number"
                min="1"
                required
                value={totalTickets}
                onChange={(e) => setTotalTickets(e.target.value)}
                placeholder="100"
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-red-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-red-300 mb-1">
                Available Tickets *
              </label>
              <input
                type="number"
                min="0"
                required
                value={availableTickets}
                onChange={(e) => setAvailableTickets(e.target.value)}
                placeholder="100"
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-red-500 font-bold"
              />
            </div>
          </div>

          {/* Start Date & End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Start Time & End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="06:00 PM"
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                End Time
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="10:00 PM"
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Organizer & External Ticket URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Organizer Name
              </label>
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="FanHub Community"
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                External Ticket URL (Optional)
              </label>
              <input
                type="url"
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
                placeholder="https://ticketbox.pk/event/123"
                className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Event Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-bold"
            >
              {STATUS_LIST.filter((s) => s !== 'All Statuses').map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Event Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full highlights, special guests, schedule and event information..."
              className="w-full px-3.5 py-2 bg-black border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 leading-relaxed"
            />
          </div>

          {/* Banner Image Upload or URL */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-300">
              Event Cover Banner (Cloudinary Upload or Direct URL)
            </label>
            <div className="flex items-center gap-3">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-16 h-12 rounded-xl object-cover bg-zinc-950 border border-white/15 shrink-0"
                />
              ) : (
                <div className="w-16 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 shrink-0">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-500/20 file:text-red-300 hover:file:bg-red-500/30 cursor-pointer"
                />
                <input
                  type="text"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    if (!imageFile) setImagePreview(e.target.value);
                  }}
                  placeholder="Or enter banner image URL (https://...)"
                  className="w-full px-3.5 py-1.5 bg-black border border-white/15 rounded-xl text-xs font-mono text-zinc-300 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Featured & Published Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeaturedEvent"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="accent-red-600 rounded w-4 h-4 cursor-pointer"
              />
              <label htmlFor="isFeaturedEvent" className="text-xs font-bold text-zinc-200 cursor-pointer">
                Feature in Homepage Showcase
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublishedEvent"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="accent-red-600 rounded w-4 h-4 cursor-pointer"
              />
              <label htmlFor="isPublishedEvent" className="text-xs font-bold text-zinc-200 cursor-pointer">
                Publish Publicly (Visible to Users)
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs text-zinc-400 hover:text-white bg-white/5 rounded-xl transition-colors font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-black bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Admin Bookings Management Viewer Modal */}
      <Modal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        title={selectedEventForBookings ? `Bookings: ${selectedEventForBookings.title}` : 'All Event Ticket Bookings'}
        size="xl"
      >
        <div className="space-y-4">
          {/* Search bar inside modal */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={bookingsSearch}
                onChange={(e) => setBookingsSearch(e.target.value)}
                placeholder="Search by reference, attendee name, email or phone..."
                className="w-full pl-10 pr-4 py-2 bg-black border border-white/15 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <span className="text-xs font-mono font-bold text-red-400 shrink-0">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'Booking' : 'Bookings'}
            </span>
          </div>

          {/* Bookings Table */}
          <div className="rounded-2xl border border-white/10 bg-black/60 overflow-hidden max-h-[55vh] overflow-y-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-white/[0.04] text-zinc-400 font-black uppercase text-[10px] tracking-wider border-b border-white/10 sticky top-0 bg-[#0c0508] z-10">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Attendee</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-3 py-3">Tier / Qty</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {isBookingsLoading && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-zinc-400">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto text-red-500 mb-2" />
                      Loading bookings...
                    </td>
                  </tr>
                )}

                {!isBookingsLoading && filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-zinc-500">
                      No ticket bookings found.
                    </td>
                  </tr>
                )}

                {!isBookingsLoading &&
                  filteredBookings.map((b) => {
                    const bId = b._id || b.id;
                    const eventTitle = b.eventId?.title || selectedEventForBookings?.title || 'Fandom Event';
                    const isCancelled = b.bookingStatus === 'Cancelled';
                    const isConfirmed = b.bookingStatus === 'Confirmed';

                    return (
                      <tr key={bId} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-mono font-bold text-red-400">
                          {b.bookingReference}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-white">{b.customerName}</div>
                          <div className="text-[10px] text-zinc-400">{b.email} • {b.phone}</div>
                        </td>
                        <td className="px-4 py-3 truncate max-w-[150px] text-zinc-300">
                          {eventTitle}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-bold text-white">{b.ticketType}</div>
                          <div className="text-[10px] font-mono text-zinc-400">{b.quantity} Pass(es)</div>
                        </td>
                        <td className="px-3 py-3 font-mono font-bold text-white">
                          PKR {b.totalAmount?.toLocaleString()}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              isCancelled
                                ? 'bg-zinc-800 text-zinc-500 border-zinc-700'
                                : isConfirmed
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            }`}
                          >
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isConfirmed && (
                              <button
                                type="button"
                                disabled={updatingBookingId === bId}
                                onClick={() => handleUpdateBookingStatus(bId, 'Confirmed')}
                                className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/40 text-[10px] font-bold transition-all"
                              >
                                Confirm
                              </button>
                            )}

                            {!isCancelled && (
                              <button
                                type="button"
                                disabled={updatingBookingId === bId}
                                onClick={() => handleUpdateBookingStatus(bId, 'Cancelled')}
                                className="px-2 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white border border-red-500/40 text-[10px] font-bold transition-all"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Fandom Event?"
        message={`Are you sure you want to permanently delete event "${selectedEvent?.title}"? Its Cloudinary banner asset will also be removed.`}
        confirmText="Delete Event"
        isLoading={isDeleting}
      />
    </div>
  );
}
