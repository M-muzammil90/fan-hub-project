import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mic, Shield, Sparkles, Tag, Film, Quote, Zap } from 'lucide-react';
import { useData } from '../context/DataContext';
import ContentCard from '../components/ContentCard';
import EmptyState from '../components/EmptyState';

export default function CharacterDetails() {
  const { slug } = useParams();
  const { characters, contentList } = useData();

  const character = characters.find((c) => c.slug === slug);

  if (!character) {
    return (
      <EmptyState
        title="Character Not Found"
        description="The character you are looking for has not been indexed in our records."
        actionText="Back to Characters"
        actionLink="/characters"
      />
    );
  }

  const imageSrc = character.avatar || character.image;
  const shortBioText = character.bio || character.shortBio;
  const bioText = character.description || character.biography || shortBioText;
  const affiliationText = character.affiliation || character.roleOrAffiliation || character.role;

  const relatedContent = contentList.filter((c) =>
    (character.fandom && c.title.toLowerCase().includes(character.fandom.toLowerCase())) ||
    c.categorySlug === character.categorySlug ||
    c.category === character.category
  ).slice(0, 4);

  return (
    <div className="space-y-10 pb-16 max-w-6xl mx-auto">
      <Link
        to="/characters"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-red-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Character Codex</span>
      </Link>

      <div className="rounded-3xl overflow-hidden border border-red-950/50 bg-gradient-to-b from-[#13080a] via-[#090b10] to-[#06070a] p-6 md:p-10 shadow-[0_0_50px_rgba(220,38,38,0.12)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="relative rounded-2xl overflow-hidden border border-red-900/30 bg-[#06070a] aspect-[3/4] shadow-xl">
            <img
              src={imageSrc}
              alt={character.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600/90 text-white border border-red-400/40 shadow-md shadow-red-950/60 backdrop-blur-md">
                {character.fandom || character.category}
              </span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <span className="text-xs font-mono text-red-400 font-semibold uppercase tracking-wider">
                Codex Entry • {character.category}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display mt-1 mb-2">
                {character.name}
              </h1>
              <p className="text-sm font-semibold text-red-300/90">
                {shortBioText}
              </p>
            </div>

            {character.quote && (
              <div className="p-4 rounded-2xl bg-[#14080b] border border-red-900/30 flex items-start gap-3">
                <Quote className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm italic text-zinc-200">
                  "{character.quote}"
                </p>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-[#0a0c13] border border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                  Affiliation & Role
                </span>
                <p className="text-zinc-200 font-semibold flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-red-400" />
                  {affiliationText || 'Independent Legend'}
                </p>
              </div>

              {character.powerLevel && (
                <div className="space-y-1">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                    Signature Power / Technique
                  </span>
                  <p className="text-zinc-200 font-semibold flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    {character.powerLevel}
                  </p>
                </div>
              )}

              {character.voiceActor && (
                <div className="space-y-1">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                    Voice Actor
                  </span>
                  <p className="text-zinc-200 font-semibold flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-red-400" />
                    {character.voiceActor}
                  </p>
                </div>
              )}

              {character.status && (
                <div className="space-y-1">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                    Status
                  </span>
                  <p className="text-red-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    {character.status}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Biography & Lore
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {bioText}
              </p>
            </div>

            {character.tags && character.tags.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Lore Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {character.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-xl bg-red-950/40 border border-red-900/30 text-red-400 text-xs font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {relatedContent.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-red-500" />
            <h3 className="text-xl font-black text-white tracking-tight font-display">
              Related Appearances & Media
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedContent.map((c) => (
              <ContentCard key={c.id} content={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
