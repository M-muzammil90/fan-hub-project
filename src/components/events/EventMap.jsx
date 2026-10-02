import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

export default function EventMap({
  latitude,
  longitude,
  venue = 'Venue',
  city = '',
  address = ''
}) {
  // Default fallback coordinates (e.g., Karachi center) if not provided
  const hasCoordinates =
    latitude !== undefined &&
    latitude !== null &&
    !isNaN(Number(latitude)) &&
    longitude !== undefined &&
    longitude !== null &&
    !isNaN(Number(longitude));

  const lat = hasCoordinates ? Number(latitude) : 24.8988;
  const lng = hasCoordinates ? Number(longitude) : 67.0782;

  // Directions link (Google Maps search / coordinates)
  const query = hasCoordinates
    ? `${lat},${lng}`
    : encodeURIComponent(`${venue} ${address} ${city}`.trim());

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.015}%2C${lat - 0.01}%2C${lng + 0.015}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className="rounded-3xl overflow-hidden bg-[#0b0b0f] border border-white/[0.08] shadow-xl space-y-4 p-5 sm:p-6">
      {/* Location Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white font-display flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            <span>{venue}</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {address ? `${address}, ` : ''}{city}
          </p>
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all hover:scale-105 border border-red-400/30 shrink-0"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get Directions</span>
          <ExternalLink className="w-3 h-3 text-red-200" />
        </a>
      </div>

      {/* Map Embed Container */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-950">
        <iframe
          title={`Map of ${venue}`}
          src={mapEmbedUrl}
          className="w-full h-full border-0 filter brightness-[0.82] contrast-[1.15] invert-[0.88] hue-rotate-[180deg]"
          loading="lazy"
        />

        {/* Pin overlay overlay badge */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/90 backdrop-blur-md border border-red-500/40 text-[11px] font-bold text-white shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>📍 {venue || 'Event Location'}</span>
          {hasCoordinates && (
            <span className="text-[10px] text-zinc-400 font-mono">
              ({lat.toFixed(4)}, {lng.toFixed(4)})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
