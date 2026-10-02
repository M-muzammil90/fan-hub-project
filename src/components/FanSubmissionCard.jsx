
import React, { useState } from 'react';
import {
  User,
  Calendar,
  CheckCircle2,
  Heart,
  ArrowUpRight,
  Clock,
  Eye,
} from 'lucide-react';

export default function FanSubmissionCard({ submission, onReadArticle }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(submission.likesCount || 142);

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (liked) {
      setLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const getCategoryStyle = (category) => {
    const c = (category || '').toLowerCase();

    if (c === 'anime')
      return 'bg-red-600/90 border-red-400/40 text-white';

    if (c === 'cosplay')
      return 'bg-rose-600/90 border-rose-400/40 text-white';

    if (c === 'comics')
      return 'bg-red-700/90 border-red-500/40 text-white';

    if (c === 'gaming')
      return 'bg-purple-600/90 border-purple-400/40 text-white';

    if (c === 'audio')
      return 'bg-amber-600/90 border-amber-400/40 text-white';

    return 'bg-red-600/90 border-red-400/40 text-white';
  };

  const rawCategory = typeof submission.category === 'object' ? submission.category?.name : submission.category;
  const categoryName = rawCategory || 'Fandom';
  const displayImage = submission.image || submission.poster || submission.thumbnail || submission.backdrop || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=85';

  return (
    <article
      onClick={() => onReadArticle?.(submission)}
      className="
        group relative
        h-full
        overflow-hidden
        rounded-[26px]
        bg-[#09090b]
        border border-white/[0.07]
        cursor-pointer
        transition-all duration-500
        hover:-translate-y-2
        hover:border-red-500/40
        hover:shadow-[0_22px_60px_rgba(220,20,50,0.20)]
      "
    >
      {/* =========================================
          IMAGE
      ========================================== */}
      <div className="relative aspect-[16/10] overflow-hidden bg-black">

        <img
          src={displayImage}
          alt={submission.title || 'Fan Creation'}
          referrerPolicy="no-referrer"
          className="
            w-full h-full object-cover
            transition-transform duration-700
            ease-out
            group-hover:scale-[1.08]
          "
        />

        {/* Dark cinematic gradient */}
        <div className="
          absolute inset-0
          bg-gradient-to-t
          from-[#08080a]
          via-black/25
          to-black/30
        " />

        {/* Red hover glow */}
        <div className="
          absolute inset-0
          bg-gradient-to-br
          from-red-600/0
          via-red-500/0
          to-red-600/0
          group-hover:from-red-600/[0.08]
          group-hover:to-red-600/[0.15]
          transition-all duration-500
        " />

        {/* =========================================
            TOP LEFT BADGES
        ========================================== */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">

          <span
            className={`
              px-3 py-1.5
              rounded-full
              text-[9px]
              font-black
              uppercase
              tracking-[0.14em]
              border
              backdrop-blur-xl
              shadow-lg
              ${getCategoryStyle(categoryName)}
            `}
          >
            {categoryName}
          </span>

          <span className="
            inline-flex
            items-center
            gap-1.5
            px-2.5 py-1.5
            rounded-full
            bg-black/65
            border border-emerald-400/25
            backdrop-blur-xl
            text-[9px]
            font-bold
            uppercase
            tracking-wider
            text-emerald-400
          ">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>

        </div>

        {/* =========================================
            LIKE BUTTON
        ========================================== */}
        <button
          type="button"
          onClick={toggleLike}
          className={`
            absolute
            top-4 right-4
            z-20
            h-9
            px-3
            rounded-full
            flex
            items-center
            gap-1.5
            backdrop-blur-xl
            border
            transition-all duration-300
            ${
              liked
                ? `
                  bg-red-600
                  border-red-400
                  text-white
                  shadow-[0_8px_25px_rgba(220,20,50,0.45)]
                  scale-105
                `
                : `
                  bg-black/60
                  border-white/15
                  text-zinc-300
                  hover:bg-red-600
                  hover:border-red-400
                  hover:text-white
                  hover:scale-105
                `
            }
          `}
          aria-label="Like submission"
        >
          <Heart
            className={`
              w-3.5 h-3.5
              transition-all
              ${liked ? 'fill-current' : ''}
            `}
          />

          <span className="text-[10px] font-bold">
            {likeCount}
          </span>
        </button>

        {/* =========================================
            IMAGE BOTTOM INFO
        ========================================== */}
        <div className="
          absolute
          bottom-4
          left-4
          right-4
          flex
          items-end
          justify-between
          z-10
        ">

          {/* Creator mini profile */}
          <div className="
            flex
            items-center
            gap-2
            min-w-0
            max-w-[65%]
          ">
            {submission.creatorAvatar ? (
              <img
                src={submission.creatorAvatar}
                alt={submission.creator}
                className="
                  w-8 h-8
                  rounded-full
                  object-cover
                  border
                  border-white/30
                  shadow-lg
                "
              />
            ) : (
              <div className="
                w-8 h-8
                rounded-full
                flex
                items-center
                justify-center
                shrink-0
                bg-gradient-to-br
                from-red-500
                to-red-800
                border border-red-300/30
                text-white
              ">
                <User className="w-3.5 h-3.5" />
              </div>
            )}

            <div className="min-w-0">
              <p className="
                text-[10px]
                uppercase
                tracking-wider
                text-zinc-400
              ">
                Created by
              </p>

              <p className="
                text-xs
                font-bold
                text-white
                truncate
              ">
                {submission.creator || 'Fan Creator'}
              </p>
            </div>
          </div>

          {/* Reading time */}
          {submission.readTime && (
            <div className="
              flex
              items-center
              gap-1.5
              px-2.5
              py-1.5
              rounded-full
              bg-black/70
              border border-white/10
              backdrop-blur-xl
              text-[10px]
              font-medium
              text-zinc-300
            ">
              <Clock className="w-3 h-3 text-red-400" />
              {submission.readTime}
            </div>
          )}

        </div>
      </div>

      {/* =========================================
          CONTENT
      ========================================== */}
      <div className="p-5">

        {/* Title */}
        <div className="flex items-start justify-between gap-3">

          <h3 className="
            flex-1
            text-[17px]
            sm:text-[18px]
            font-extrabold
            leading-[1.25]
            tracking-tight
            text-white
            line-clamp-2
            transition-colors
            duration-300
            group-hover:text-red-400
          ">
            {submission.title}
          </h3>

          <div className="
            w-8 h-8
            rounded-full
            border border-white/[0.08]
            bg-white/[0.03]
            flex
            items-center
            justify-center
            shrink-0
            transition-all duration-300
            group-hover:bg-red-600
            group-hover:border-red-400
          ">
            <ArrowUpRight
              className="
                w-4 h-4
                text-zinc-500
                group-hover:text-white
                transition-transform duration-300
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
            />
          </div>

        </div>

        {/* Description */}
        {submission.description && (
          <p className="
            mt-3
            text-[13px]
            leading-[1.65]
            text-zinc-400
            line-clamp-2
          ">
            {submission.description}
          </p>
        )}

        {/* =========================================
            QUOTE / CONTENT PREVIEW
        ========================================== */}
        {submission.content && (
          <div className="
            relative
            mt-4
            rounded-2xl
            overflow-hidden
            bg-gradient-to-br
            from-red-950/30
            to-transparent
            border border-red-500/[0.12]
            px-4 py-3.5
            transition-all duration-300
            group-hover:border-red-500/25
          ">

            {/* Red accent */}
            <div className="
              absolute
              left-0
              top-3
              bottom-3
              w-[2px]
              rounded-full
              bg-gradient-to-b
              from-red-400
              to-red-700
            " />

            <p className="
              pl-2
              text-[11px]
              leading-[1.65]
              text-zinc-400
              italic
              line-clamp-2
            ">
              "{submission.content}"
            </p>

          </div>
        )}

        {/* =========================================
            FOOTER
        ========================================== */}
        <div className="
          mt-5
          pt-4
          border-t border-white/[0.07]
          flex
          items-center
          justify-between
          gap-3
        ">

          {/* Date */}
          <div className="
            flex
            items-center
            gap-1.5
            text-[10px]
            text-zinc-500
          ">
            <Calendar className="w-3.5 h-3.5 text-red-500/70" />

            <span>
              {submission.submissionDate || '2026-03-12'}
            </span>
          </div>

          {/* Views */}
          {submission.viewsCount !== undefined && (
            <div className="
              flex
              items-center
              gap-1.5
              text-[10px]
              text-zinc-500
            ">
              <Eye className="w-3.5 h-3.5" />
              <span>{submission.viewsCount}</span>
            </div>
          )}

          {/* Read Article */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReadArticle?.(submission);
            }}
            className="
              ml-auto
              inline-flex
              items-center
              gap-1.5
              text-xs
              font-extrabold
              text-red-500
              hover:text-red-400
              transition-colors
            "
          >
            Read Article

            <ArrowUpRight
              className="
                w-3.5 h-3.5
                transition-transform duration-300
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
            />
          </button>

        </div>
      </div>

      {/* Bottom red glow */}
      <div className="
        absolute
        bottom-0
        left-[15%]
        right-[15%]
        h-px
        bg-gradient-to-r
        from-transparent
        via-red-500/50
        to-transparent
        opacity-0
        group-hover:opacity-100
        transition-opacity duration-500
      " />

    </article>
  );
}


