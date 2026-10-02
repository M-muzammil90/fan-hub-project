import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Play,
  ArrowRight,
  Star,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
} from "lucide-react";

import { heroSlidesData } from "../../data/homepage";

export default function HeroSlider({
  slides = heroSlidesData,
  onWatch,
  autoPlayInterval = 6000,
}) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const getSlideLink = (slide) => {
    if (!slide) return '/';
    if (slide.link) return slide.link;
    const isSeries =
      slide.badge === 'SERIES' ||
      slide.type === 'series' ||
      slide.contentType === 'series' ||
      (slide.category &&
        (slide.category === 'series' ||
          slide.category?.slug === 'series' ||
          slide.category?.name?.toLowerCase() === 'series'));
    const slug = slide.slug || slide.id || slide._id;
    return isSeries ? `/series/${slug}` : `/content/${slug}`;
  };

  const timerRef = useRef(null);

  /* =====================================================
     SLIDES
  ===================================================== */

  const activeSlides =
    Array.isArray(slides) && slides.length > 0
      ? slides
      : heroSlidesData;

  const total = activeSlides.length;

  const safeIndex =
    total > 0
      ? Math.min(currentIndex, total - 1)
      : 0;

  const currentSlide = activeSlides[safeIndex];

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const goToSlide = useCallback(
    (index) => {
      if (total <= 1) return;

      setCurrentIndex(
        ((index % total) + total) % total
      );
    },
    [total]
  );

  const nextSlide = useCallback(() => {
    goToSlide(safeIndex + 1);
  }, [goToSlide, safeIndex]);

  const prevSlide = useCallback(() => {
    goToSlide(safeIndex - 1);
  }, [goToSlide, safeIndex]);

  /* =====================================================
     AUTO PLAY
  ===================================================== */

  useEffect(() => {
    if (isPaused || total <= 1) return;

    timerRef.current = setTimeout(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    isPaused,
    total,
    nextSlide,
    autoPlayInterval,
    safeIndex,
  ]);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        nextSlide();
      }

      if (event.key === "ArrowLeft") {
        prevSlide();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [nextSlide, prevSlide]);

  /* =====================================================
     MOBILE SWIPE
  ===================================================== */

  const handleTouchStart = (event) => {
    setTouchStartX(
      event.touches[0].clientX
    );
  };

  const handleTouchEnd = (event) => {
    if (touchStartX === null) return;

    const touchEndX =
      event.changedTouches[0].clientX;

    const difference =
      touchStartX - touchEndX;

    if (Math.abs(difference) > 60) {
      if (difference > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    setTouchStartX(null);
  };

  /* =====================================================
     EMPTY STATE
  ===================================================== */

  if (!total || !currentSlide) {
    return null;
  }

  /* =====================================================
     GENRES
  ===================================================== */

  const genres =
    currentSlide.genre ||
    currentSlide.genres ||
    [];

  const genreList = Array.isArray(genres)
    ? genres.slice(0, 2)
    : genres
      ? [genres]
      : [];

  /* =====================================================
     IMAGE
  ===================================================== */

  const getImage = (slide) =>
    slide.image ||
    slide.backdrop ||
    slide.poster ||
    slide.thumbnail;

  return (
    <section
      aria-label="Featured content"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={() => navigate(getSlideLink(currentSlide))}
      className="
        group
        relative
        w-full
        overflow-hidden
        cursor-pointer
        select-none

        rounded-[20px]

        bg-[#050505]

        text-white

        border
        border-red-500/50

        shadow-[0_0_30px_rgba(239,68,68,0.16)]

        h-[360px]
        sm:h-[420px]
        md:h-[460px]
        lg:h-[500px]
        xl:h-[470px]
      "
    >

      {/* =====================================================
          BACKGROUND SLIDES
      ===================================================== */}

      <div className="absolute inset-0">

        {activeSlides.map((slide, index) => {

          const image = getImage(slide);

          const isActive =
            index === safeIndex;

          return (
            <div
              key={slide.id ?? index}
              className={`
                absolute
                inset-0

                transition-opacity
                duration-[1000ms]
                ease-in-out

                ${isActive
                  ? "z-10 opacity-100"
                  : "z-0 opacity-0"
                }
              `}
            >

              {/* IMAGE */}

              <img
                src={image}
                alt={slide.title || "Featured content"}
                loading={
                  index === 0
                    ? "eager"
                    : "lazy"
                }
                referrerPolicy="no-referrer"
                className={`
                  absolute
                  inset-0

                  h-full
                  w-full

                  object-cover
                  object-[center_15%]
                  sm:object-[center_20%]
                  md:object-[center_25%]

                  transition-transform
                  duration-[7000ms]
                  ease-out

                  ${isActive
                    ? "scale-[1.02]"
                    : "scale-100"
                  }
                `}
              />

              {/* =================================================
                  MAIN DARK GRADIENT
              ================================================= */}

              <div
                className="
                  absolute
                  inset-0

                  bg-gradient-to-r
                  from-black/95
                  via-black/55
                  to-transparent
                "
              />

              {/* =================================================
                  BOTTOM DARK GRADIENT
              ================================================= */}

              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0

                  h-[48%]

                  bg-gradient-to-t
                  from-black/90
                  via-black/35
                  to-transparent
                "
              />

              {/* =================================================
                  TOP DARKNESS
              ================================================= */}

              <div
                className="
                  absolute
                  inset-x-0
                  top-0

                  h-[25%]

                  bg-gradient-to-b
                  from-black/35
                  to-transparent
                "
              />

              {/* =================================================
                  RED CINEMATIC LIGHT
              ================================================= */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0

                  bg-[radial-gradient(
                    circle_at_72%_50%,
                    rgba(239,68,68,0.10),
                    transparent_42%
                  )]
                "
              />

            </div>
          );
        })}

      </div>


      {/* =====================================================
          DESKTOP CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-20

          hidden
          h-full

          items-center

          px-8
          md:flex
          md:px-12
          lg:px-14
          xl:px-16
        "
      >

        <div
          key={
            currentSlide.id ??
            safeIndex
          }
          className="
            w-full
            max-w-[540px]

            animate-[heroContent_0.65s_ease-out]
          "
        >

          {/* =================================================
              BADGE
          ================================================= */}

          <div
            className="
              mb-4

              inline-flex
              items-center
              gap-2

              rounded-full

              border
              border-red-400/40

              bg-red-600

              px-4
              py-1.5

              shadow-[0_0_20px_rgba(239,68,68,0.25)]
            "
          >

            <Sparkles
              className="
                h-3.5
                w-3.5
                fill-white
              "
            />

            <span
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.16em]
              "
            >
              {currentSlide.badge ||
                "Featured"}
            </span>

          </div>


          {/* =================================================
              TITLE
          ================================================= */}

          <h1
            className="
              max-w-[560px]

              text-4xl
              font-black

              leading-[1.02]

              tracking-[-0.03em]

              text-white

              drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)]

              lg:text-5xl
              xl:text-[56px]
            "
          >
            {currentSlide.title}
          </h1>


          {/* =================================================
              SUBTITLE
          ================================================= */}

          {currentSlide.subtitle && (
            <h2
              className="
                mt-3

                text-lg
                font-bold

                text-red-500

                lg:text-xl
              "
            >
              {currentSlide.subtitle}
            </h2>
          )}


          {/* =================================================
              META
          ================================================= */}

          <div
            className="
              mt-5

              flex
              flex-wrap
              items-center

              gap-2
            "
          >

            {/* RATING */}

            {currentSlide.rating != null && (
              <div
                className="
                  flex
                  items-center
                  gap-1.5

                  rounded-lg

                  border
                  border-yellow-500/25

                  bg-black/60

                  px-3
                  py-1.5

                  text-xs
                  font-bold

                  text-yellow-400

                  backdrop-blur-md
                "
              >

                <Star
                  className="
                    h-3.5
                    w-3.5

                    fill-yellow-400
                  "
                />

                {Number(
                  currentSlide.rating
                ).toFixed(1)}

              </div>
            )}


            {/* YEAR */}

            {currentSlide.year && (
              <div
                className="
                  flex
                  items-center
                  gap-1.5

                  rounded-lg

                  border
                  border-white/10

                  bg-black/60

                  px-3
                  py-1.5

                  text-xs
                  font-semibold

                  text-white/85

                  backdrop-blur-md
                "
              >

                <Calendar
                  className="
                    h-3.5
                    w-3.5

                    text-red-400
                  "
                />

                {currentSlide.year}

              </div>
            )}


            {/* GENRES */}

            {genreList.map(
              (genre, index) => (
                <span
                  key={index}
                  className="
                    rounded-lg

                    border
                    border-white/10

                    bg-white/10

                    px-3
                    py-1.5

                    text-[11px]
                    font-semibold

                    text-white/80

                    backdrop-blur-md
                  "
                >
                  {genre}
                </span>
              )
            )}

          </div>


          {/* =================================================
              BUTTONS
          ================================================= */}

          <div
            className="
              mt-7

              flex
              items-center

              gap-3
            "
          >

            {/* WATCH */}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(getSlideLink(currentSlide));
              }}
              className="
                inline-flex
                items-center
                gap-2

                rounded-full

                bg-red-600

                border
                border-red-400/50

                px-6
                py-3

                text-sm
                font-black

                text-white

                shadow-[0_8px_30px_rgba(239,68,68,0.35)]

                transition-all
                duration-300

                hover:bg-red-500
                hover:scale-105
                hover:shadow-[0_10px_35px_rgba(239,68,68,0.55)]

                active:scale-95
              "
            >

              <Play
                className="
                  h-4
                  w-4
                  fill-current
                "
              />

              Watch Now

            </button>


            {/* MORE INFO */}

            <Link
              to={getSlideLink(currentSlide)}
              onClick={(e) => e.stopPropagation()}
              className="
                inline-flex
                items-center
                gap-2

                rounded-full

                border
                border-red-500/50

                bg-black/50

                px-6
                py-3

                text-sm
                font-bold

                text-white

                backdrop-blur-md

                transition-all
                duration-300

                hover:border-red-500
                hover:bg-red-600
                hover:scale-105

                active:scale-95
              "
            >

              <Info
                className="
                  h-4
                  w-4
                "
              />

              More Info

              <ArrowRight
                className="
                  h-4
                  w-4
                  opacity-80
                "
              />

            </Link>

          </div>

        </div>

      </div>


      {/* =====================================================
          CENTER / RIGHT PLAY BADGE OVERLAY
      ===================================================== */}
      <div className="pointer-events-none absolute right-12 lg:right-20 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-20">
        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-[0_0_35px_rgba(239,68,68,0.7)] border border-red-300/40 transform group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300 backdrop-blur-md">
          <Play className="h-7 w-7 lg:h-9 lg:w-9 fill-white ml-1" />
        </div>
      </div>


      {/* =====================================================
          MOBILE TITLE ONLY
      ===================================================== */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0

          z-20

          flex
          items-end
          justify-between

          px-5
          pb-8

          md:hidden
        "
      >

        <h1
          key={
            currentSlide.id ??
            safeIndex
          }
          className="
            max-w-[75%]

            text-2xl
            font-black

            leading-tight

            tracking-tight

            text-white

            drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]

            animate-[mobileTitle_0.5s_ease-out]
          "
        >
          {currentSlide.title}
        </h1>

        <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.6)] border border-red-300/40">
          <Play className="h-5 w-5 fill-white ml-0.5" />
        </div>

      </div>


      {/* =====================================================
          DESKTOP LEFT ARROW
      ===================================================== */}

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous slide"
            className="
              absolute

              left-5
              top-1/2

              z-30

              hidden

              h-11
              w-11

              -translate-y-1/2

              items-center
              justify-center

              rounded-full

              border
              border-red-500/40

              bg-black/60

              text-white

              backdrop-blur-md

              shadow-[0_0_18px_rgba(239,68,68,0.12)]

              transition-all
              duration-300

              hover:border-red-500
              hover:bg-red-600
              hover:shadow-[0_0_25px_rgba(239,68,68,0.45)]
              hover:scale-110

              md:flex
            "
          >
            <ChevronLeft className="h-5 w-5" />
          </button>


          {/* RIGHT ARROW */}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next slide"
            className="
              absolute

              right-5
              top-1/2

              z-30

              hidden

              h-11
              w-11

              -translate-y-1/2

              items-center
              justify-center

              rounded-full

              border
              border-red-500/40

              bg-black/60

              text-white

              backdrop-blur-md

              shadow-[0_0_18px_rgba(239,68,68,0.12)]

              transition-all
              duration-300

              hover:border-red-500
              hover:bg-red-600
              hover:shadow-[0_0_25px_rgba(239,68,68,0.45)]
              hover:scale-110

              md:flex
            "
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}


      {/* =====================================================
          BOTTOM DOTS
      ===================================================== */}

      {total > 1 && (
        <div
          className="
            absolute

            bottom-5
            right-6

            z-30

            flex
            items-center
            gap-2
          "
        >

          {activeSlides.map(
            (_, index) => {

              const active =
                index === safeIndex;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  aria-label={`Go to slide ${index + 1
                    }`}
                  className={`
                    h-2
                    rounded-full

                    transition-all
                    duration-300

                    ${active
                      ? `
                          w-8
                          bg-red-500

                          shadow-[0_0_12px_rgba(239,68,68,0.85)]
                        `
                      : `
                          w-2
                          bg-white/40

                          hover:bg-white/75
                        `
                    }
                  `}
                />
              );
            }
          )}

        </div>
      )}


      {/* =====================================================
          RED INNER BORDER
      ===================================================== */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          z-40

          rounded-[20px]

          border
          border-red-500/20

          shadow-[inset_0_0_25px_rgba(239,68,68,0.08)]
        "
      />


      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`

        @keyframes heroContent {

          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }


        @keyframes mobileTitle {

          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

      `}</style>

    </section>
  );
}