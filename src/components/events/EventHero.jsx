import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Ticket,
  Flame,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Clock,
  ChevronRight,
} from 'lucide-react';

import EventTypeBadge from './EventTypeBadge';
import EventStatusBadge from './EventStatusBadge';

export default function EventHero({ event }) {
  if (!event) return null;

  // =========================================================
  // DATE
  // =========================================================

  const dateObj = new Date(event.startDate);

  const isValidDate = !Number.isNaN(dateObj.getTime());

  const formattedDate = isValidDate
    ? dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBA';

  const monthName = isValidDate
    ? dateObj
        .toLocaleString('en-US', {
          month: 'short',
        })
        .toUpperCase()
    : 'TBA';

  const dayNum = isValidDate
    ? dateObj.getDate()
    : '';

  const eventIdentifier = event.slug || event._id;

  // =========================================================
  // IMAGE
  // =========================================================

  const eventImage =
    event.image ||
    event.coverImage ||
    event.thumbnail ||
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=90';

  // =========================================================
  // CATEGORY
  // =========================================================

  const categoryName =
    typeof event.category === 'object'
      ? event.category?.name || 'FANDOM'
      : event.category || 'FANDOM';

  return (
    <section
      className="
        group relative isolate
        w-full overflow-hidden
        rounded-[28px]
        border border-white/[0.08]
        bg-[#090a0f]
        shadow-[0_25px_90px_rgba(0,0,0,0.55)]
        transition-all duration-500
        hover:border-[#ff1738]/40
      "
    >
      {/* =====================================================
          BACKGROUND AMBIENT LIGHT
      ====================================================== */}

      <div
        className="
          pointer-events-none absolute
          -right-32 -top-32
          h-[420px] w-[420px]
          rounded-full
          bg-[#ff1738]/10
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none absolute
          -bottom-40 left-1/4
          h-[350px] w-[350px]
          rounded-full
          bg-red-950/30
          blur-[100px]
        "
      />

      {/* =====================================================
          CINEMATIC BACKGROUND IMAGE
      ====================================================== */}

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={eventImage}
          alt=""
          referrerPolicy="no-referrer"
          className="
            h-full w-full
            object-cover object-center
            opacity-[0.18]
            blur-[1px]
            scale-105
            transition-all duration-1000
            group-hover:scale-110
            group-hover:opacity-[0.24]
          "
        />

        <div className="absolute inset-0 bg-[#07080c]/85" />

        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-[#090a0f]
            via-[#090a0f]/95
            to-[#090a0f]/55
          "
        />

        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-[#090a0f]
            via-transparent
            to-[#090a0f]/40
          "
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 grid lg:grid-cols-12">
        {/* ===================================================
            LEFT CONTENT
        ==================================================== */}

        <div
          className="
            flex flex-col justify-between
            p-6
            sm:p-8
            lg:col-span-7
            lg:min-h-[470px]
            lg:p-10
            xl:p-12
          "
        >
          <div>
            {/* =================================================
                TOP BADGES
            ================================================== */}

            <div className="mb-5 flex flex-wrap items-center gap-2">
              {/* Featured */}

              <span
                className="
                  inline-flex items-center gap-1.5
                  rounded-full
                  border border-red-400/30
                  bg-[#ff1738]
                  px-3.5 py-1.5
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.12em]
                  text-white
                  shadow-[0_6px_25px_rgba(255,23,56,0.25)]
                "
              >
                <Flame className="h-3.5 w-3.5 fill-current" />

                Featured
              </span>

              {/* Category */}

              <span
                className="
                  rounded-full
                  border border-white/10
                  bg-white/[0.06]
                  px-3 py-1.5
                  text-[9px]
                  font-black
                  uppercase
                  tracking-wider
                  text-zinc-300
                  backdrop-blur-md
                "
              >
                {categoryName}
              </span>

              <EventTypeBadge
                type={event.eventType || 'Convention'}
              />

              <EventStatusBadge
                status={event.status || 'Upcoming'}
              />
            </div>

            {/* =================================================
                TITLE
            ================================================== */}

            <div className="max-w-3xl">
              <h1
                className="
                  text-3xl
                  font-black
                  leading-[1.02]
                  tracking-[-0.03em]
                  text-white
                  sm:text-4xl
                  lg:text-5xl
                  xl:text-6xl
                "
              >
                {event.title}
              </h1>

              {/* Red underline */}

              <div
                className="
                  mt-5
                  h-1
                  w-16
                  rounded-full
                  bg-[#ff1738]
                  shadow-[0_0_18px_rgba(255,23,56,0.65)]
                "
              />
            </div>

            {/* =================================================
                META INFORMATION
            ================================================== */}

            <div className="mt-6 flex flex-wrap gap-3">
              {/* Date */}

              <div
                className="
                  flex items-center gap-2
                  rounded-xl
                  border border-white/[0.08]
                  bg-black/25
                  px-3.5 py-2.5
                  backdrop-blur-md
                "
              >
                <Calendar className="h-4 w-4 text-[#ff1738]" />

                <span className="text-xs font-bold text-white">
                  {formattedDate}
                </span>
              </div>

              {/* Time */}

              {event.startTime && (
                <div
                  className="
                    flex items-center gap-2
                    rounded-xl
                    border border-white/[0.08]
                    bg-black/25
                    px-3.5 py-2.5
                    backdrop-blur-md
                  "
                >
                  <Clock className="h-4 w-4 text-[#ff1738]" />

                  <span className="text-xs font-bold text-white">
                    {event.startTime}
                    {event.endTime
                      ? ` - ${event.endTime}`
                      : ''}
                  </span>
                </div>
              )}

              {/* Location */}

              <div
                className="
                  flex max-w-full items-center gap-2
                  rounded-xl
                  border border-white/[0.08]
                  bg-black/25
                  px-3.5 py-2.5
                  backdrop-blur-md
                "
              >
                <MapPin className="h-4 w-4 shrink-0 text-[#ff1738]" />

                <span className="max-w-[280px] truncate text-xs font-bold text-zinc-300">
                  {event.venue
                    ? `${event.venue}${event.city ? `, ${event.city}` : ''}`
                    : event.city || 'Location TBA'}
                </span>
              </div>
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================== */}

            {event.description && (
              <p
                className="
                  mt-6
                  max-w-2xl
                  line-clamp-3
                  text-sm
                  leading-6
                  text-zinc-400
                  sm:text-[15px]
                "
              >
                {event.description}
              </p>
            )}
          </div>

          {/* =================================================
              ACTIONS
          ================================================== */}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* View Details */}

            <Link
              to={`/events/${eventIdentifier}`}
              className="
                group/primary
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#ff1738]
                px-6
                py-3.5
                text-xs
                font-black
                text-white
                shadow-[0_10px_35px_rgba(255,23,56,0.3)]
                transition-all
                duration-300
                hover:bg-[#ff2948]
                hover:shadow-[0_12px_45px_rgba(255,23,56,0.45)]
                active:scale-[0.98]
                sm:text-sm
              "
            >
              <span>View Event Details</span>

              <ArrowRight
                className="
                  h-4 w-4
                  transition-transform
                  duration-300
                  group-hover/primary:translate-x-1
                "
              />
            </Link>

            {/* Ticket */}

            {event.ticketUrl ? (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border border-white/10
                  bg-white/[0.06]
                  px-5
                  py-3.5
                  text-xs
                  font-black
                  text-white
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:border-[#ff1738]/50
                  hover:bg-white/[0.1]
                  sm:text-sm
                "
              >
                <Ticket className="h-4 w-4 text-[#ff1738]" />

                <span>Get Tickets</span>

                <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
              </a>
            ) : (
              <Link
                to={`/events/${eventIdentifier}`}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border border-white/10
                  bg-white/[0.06]
                  px-5
                  py-3.5
                  text-xs
                  font-bold
                  text-white
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:border-[#ff1738]/50
                  hover:bg-white/[0.1]
                  sm:text-sm
                "
              >
                <Sparkles className="h-4 w-4 text-[#ff1738]" />

                <span>Pass & Schedule Info</span>
              </Link>
            )}
          </div>
        </div>

        {/* ===================================================
            RIGHT IMAGE
        ==================================================== */}

        <div
          className="
            relative
            min-h-[300px]
            overflow-hidden
            sm:min-h-[380px]
            lg:col-span-5
            lg:min-h-[470px]
          "
        >
          {/* Main image */}

          <img
            src={eventImage}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="
              absolute inset-0
              h-full w-full
              object-cover
              object-center
              transition-transform
              duration-1000
              group-hover:scale-105
            "
          />

          {/* Image quality overlay */}

          <div
            className="
              absolute inset-0
              bg-gradient-to-r
              from-[#090a0f]
              via-transparent
              to-transparent
              lg:from-[#090a0f]
              lg:via-[#090a0f]/10
              lg:to-transparent
            "
          />

          <div
            className="
              absolute inset-0
              bg-gradient-to-t
              from-black/80
              via-transparent
              to-black/10
            "
          />

          {/* =================================================
              DATE CARD
          ================================================== */}

          <div
            className="
              absolute
              right-5
              top-5
              z-20
              flex
              min-w-[68px]
              flex-col
              items-center
              rounded-2xl
              border border-red-400/30
              bg-black/75
              px-3
              py-2.5
              shadow-[0_12px_40px_rgba(0,0,0,0.45)]
              backdrop-blur-xl
            "
          >
            <span
              className="
                text-[9px]
                font-black
                tracking-[0.18em]
                text-[#ff1738]
              "
            >
              {monthName}
            </span>

            {dayNum && (
              <span
                className="
                  mt-0.5
                  text-2xl
                  font-black
                  leading-none
                  text-white
                "
              >
                {dayNum}
              </span>
            )}
          </div>

          {/* =================================================
              IMAGE LABEL
          ================================================== */}

          <div
            className="
              absolute
              bottom-5
              left-5
              right-5
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border border-white/10
                bg-black/65
                px-3
                py-2
                backdrop-blur-xl
              "
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff1738]" />

              <span className="text-[9px] font-black uppercase tracking-wider text-white">
                Live Fandom Experience
              </span>
            </div>

            <Link
              to={`/events/${eventIdentifier}`}
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#ff1738]
                text-white
                shadow-[0_8px_25px_rgba(255,23,56,0.4)]
                transition-all
                hover:scale-110
              "
              aria-label="View event"
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM ACCENT
      ====================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          h-[2px]
          w-full
          bg-gradient-to-r
          from-transparent
          via-[#ff1738]
          to-transparent
          opacity-70
        "
      />
    </section>
  );
}