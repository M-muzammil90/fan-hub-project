import React, { useState } from 'react';
import { MapPin, Navigation, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { eventApi } from '../../services/event.api';
import EventCard from './EventCard';
import { CITIES_LIST } from './EventFilters';

export default function NearbyEvents({ onCitySelect }) {
  const [isLocating, setIsLocating] = useState(false);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | loading | success | denied | error
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFallbackCity, setSelectedFallbackCity] = useState('');

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('loading');
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await eventApi.getNearbyEvents(latitude, longitude, 300); // 300km radius
          if (res.success) {
            setNearbyEvents(res.events || []);
            setLocationStatus('success');
            setHasSearched(true);
          } else {
            setLocationStatus('error');
            setErrorMessage(res.message || 'Unable to retrieve nearby events from server.');
          }
        } catch (err) {
          setLocationStatus('error');
          setErrorMessage(err.message || 'Failed to search nearby events.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('denied');
          setErrorMessage('Location access is disabled in your browser.');
        } else {
          setLocationStatus('error');
          setErrorMessage('Unable to determine your current position. Please select a city manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const handleFallbackCityChange = async (cityName) => {
    setSelectedFallbackCity(cityName);
    if (!cityName || cityName === 'All Cities') return;

    if (onCitySelect) {
      onCitySelect(cityName);
    }

    setIsLocating(true);
    setErrorMessage('');
    try {
      const res = await eventApi.getEvents({ city: cityName });
      if (res.success) {
        setNearbyEvents(res.events || []);
        setLocationStatus('success');
        setHasSearched(true);
      }
    } catch (err) {
      setErrorMessage('Failed to load events for ' + cityName);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#120609] via-[#090b10] to-[#07080c] border border-red-500/30 shadow-[0_0_40px_rgba(255,23,56,0.15)] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30">
              <MapPin className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Events Near You
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Discover conventions, anime screenings, and cosplay meetups happening closest to your area.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFindNearby}
          disabled={isLocating}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-black text-xs sm:text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-105 border border-red-400/40 shrink-0"
        >
          {isLocating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Locating Events...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              <span>Find Events Near Me</span>
            </>
          )}
        </button>
      </div>

      {/* Permission Denied or Location Error Alert with Manual City Fallback */}
      {(locationStatus === 'denied' || locationStatus === 'error') && (
        <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-red-500/30 space-y-3">
          <div className="flex items-center gap-2.5 text-red-400 text-xs sm:text-sm font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>

          <p className="text-xs text-zinc-400">
            You can manually pick your city below to discover local fandom gatherings:
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {CITIES_LIST.filter((c) => c !== 'All Cities').map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handleFallbackCityChange(city)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedFallbackCity === city
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-[#14080b] text-zinc-300 hover:text-white border border-white/10 hover:border-red-500/40'
                }`}
              >
                📍 {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Results Display */}
      {hasSearched && locationStatus === 'success' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-white/10 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Found {nearbyEvents.length} nearby {nearbyEvents.length === 1 ? 'event' : 'events'}</span>
            </span>
            {selectedFallbackCity && (
              <span className="font-mono text-zinc-300">Selected City: {selectedFallbackCity}</span>
            )}
          </div>

          {nearbyEvents.length === 0 ? (
            <div className="py-8 text-center bg-black/40 rounded-2xl border border-white/5 space-y-2">
              <p className="text-xs sm:text-sm text-zinc-300 font-semibold">
                No events found in this radius currently.
              </p>
              <p className="text-xs text-zinc-500">
                Check back soon or select another city above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {nearbyEvents.map((evt) => (
                <EventCard key={evt._id || evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
