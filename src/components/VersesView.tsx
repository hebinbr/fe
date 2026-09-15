import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Volume2,
  Share2,
  Heart,
  Copy,
  Check,
  Bookmark,
  BookOpen
} from 'lucide-react';
import { BibleVerse, UserPreferences } from '../types';
import { BIBLE_VERSES_DATA } from '../data/versesData';
import { devotionalTTS, TTSState } from '../utils/audioEngine';
import { ShareVerseModal } from './ShareVerseModal';

interface VersesViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  ttsState: TTSState;
}

export const VersesView: React.FC<VersesViewProps> = ({
  preferences,
  onUpdatePreferences,
  ttsState,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeModalVerse, setActiveModalVerse] = useState<BibleVerse | null>(null);

  const verseOfTheDay = BIBLE_VERSES_DATA[0];

  const themes = ['Todos', 'Ansiedade', 'Paz', 'Força', 'Esperança', 'Fé', 'Gratidão', 'Sabedoria', 'Amor'];

  const filteredVerses = useMemo(() => {
    return BIBLE_VERSES_DATA.filter((verse) => {
      const matchesTheme = selectedTheme === 'Todos' || verse.theme === selectedTheme;
      const matchesSearch =
        searchQuery.trim() === '' ||
        verse.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        verse.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        verse.reflectionShort.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorite = !onlyFavorites || preferences.favoriteVerses.includes(verse.id);

      return matchesTheme && matchesSearch && matchesFavorite;
    });
  }, [selectedTheme, searchQuery, onlyFavorites, preferences.favoriteVerses]);

  const toggleFavorite = (id: string) => {
    const isFav = preferences.favoriteVerses.includes(id);
    const updated = isFav
      ? preferences.favoriteVerses.filter((favId) => favId !== id)
      : [...preferences.favoriteVerses, id];
    onUpdatePreferences({ favoriteVerses: updated });
  };

  const copyVerse = async (verse: BibleVerse) => {
    try {
      await navigator.clipboard.writeText(`"${verse.text}" — ${verse.reference} (${verse.version})`);
      setCopiedId(verse.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSpeakVerse = (verse: BibleVerse) => {
    if (ttsState.isSpeaking) {
      devotionalTTS.stop();
    } else {
      devotionalTTS.speak(verse.reference, [`${verse.reference}. ${verse.text}`, verse.reflectionShort]);
    }
  };

  return (
    <div id="verses-view" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Verse of the Day Banner */}
      <div
        id="verse-of-the-day-hero"
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#F5EFE4] via-[#EFE5D3] to-[#E5D7BE] border border-[#DECEB7] shadow-sm relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#8C6D3F] text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B522F]">
              Versículo do Dia
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-speak-verse-of-day"
              onClick={() => handleSpeakVerse(verseOfTheDay)}
              className="p-2 rounded-xl bg-white/70 hover:bg-white text-[#524535] transition-colors"
              title="Ouvir versículo"
            >
              <Volume2 className="w-4 h-4 text-[#8C6D3F]" />
            </button>
            <button
              id="btn-share-verse-of-day"
              onClick={() => setActiveModalVerse(verseOfTheDay)}
              className="p-2 rounded-xl bg-white/70 hover:bg-white text-[#524535] transition-colors"
              title="Gerar cartão para compartilhar"
            >
              <Share2 className="w-4 h-4 text-[#8C6D3F]" />
            </button>
          </div>
        </div>

        <blockquote className="font-serif-devotional text-xl sm:text-2xl text-[#2B2319] italic leading-relaxed mb-3">
          "{verseOfTheDay.text}"
        </blockquote>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-[#D9C7AC]">
          <span className="font-semibold text-sm text-[#4E3F2A]">
            {verseOfTheDay.reference} • {verseOfTheDay.version}
          </span>
          <p className="text-xs text-[#73634E] italic">
            ✦ {verseOfTheDay.reflectionShort}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C8375] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-verses"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por versículo, livro (Salmos, Mateus...) ou tema..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2D8C9] bg-white text-sm text-[#2E281F] placeholder:text-[#9E9587] focus:outline-none focus:ring-2 focus:ring-[#8C6D3F]/40 focus:border-[#8C6D3F] transition-all"
            />
          </div>

          {/* Favorites Filter Toggle */}
          <button
            id="btn-filter-favorites"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              onlyFavorites
                ? 'bg-[#FFF2D9] border-[#F4D293] text-[#A66E14] font-semibold'
                : 'border-[#E2D8C9] bg-[#FAF8F5] text-[#6C6356] hover:bg-[#EFE9DF]'
            }`}
          >
            <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-current text-[#D97706]' : ''}`} />
            <span>Favoritos ({preferences.favoriteVerses.length})</span>
          </button>
        </div>

        {/* Theme Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {themes.map((theme) => (
            <button
              key={theme}
              id={`theme-pill-${theme.toLowerCase()}`}
              onClick={() => setSelectedTheme(theme)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTheme === theme
                  ? 'bg-[#8C6D3F] text-white shadow-xs'
                  : 'bg-[#EFE9DF] text-[#615748] hover:bg-[#E4DBCF]'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Verses Grid */}
      <div id="verses-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVerses.length > 0 ? (
          filteredVerses.map((verse) => {
            const isFav = preferences.favoriteVerses.includes(verse.id);
            const isBeingCopied = copiedId === verse.id;

            return (
              <div
                key={verse.id}
                id={`verse-card-${verse.id}`}
                className="p-5 sm:p-6 rounded-2xl bg-[#FFFDFB] border border-[#E8E1D5] hover:border-[#D8C9B4] hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#F0EAE1] text-[#6B5A42]">
                      {verse.theme}
                    </span>
                    <span className="text-[11px] text-[#91877A]">{verse.version}</span>
                  </div>

                  <blockquote className="font-serif-devotional text-base sm:text-lg text-[#2B2319] leading-relaxed italic">
                    "{verse.text}"
                  </blockquote>

                  <p className="mt-3 text-xs text-[#7A7165] italic border-l-2 border-[#D9CEBF] pl-2.5">
                    {verse.reflectionShort}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
                  <span className="font-semibold text-xs sm:text-sm text-[#3E3426]">
                    {verse.reference}
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Audio TTS */}
                    <button
                      id={`btn-speak-verse-${verse.id}`}
                      onClick={() => handleSpeakVerse(verse)}
                      className="p-1.5 rounded-lg text-[#7A7165] hover:text-[#8C6D3F] hover:bg-[#F5EFE4] transition-colors"
                      title="Ouvir em áudio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* Copy Text */}
                    <button
                      id={`btn-copy-verse-${verse.id}`}
                      onClick={() => copyVerse(verse)}
                      className="p-1.5 rounded-lg text-[#7A7165] hover:text-[#8C6D3F] hover:bg-[#F5EFE4] transition-colors"
                      title="Copiar texto"
                    >
                      {isBeingCopied ? (
                        <Check className="w-4 h-4 text-[#2D6A3E]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {/* Share Card Modal */}
                    <button
                      id={`btn-share-card-${verse.id}`}
                      onClick={() => setActiveModalVerse(verse)}
                      className="p-1.5 rounded-lg text-[#7A7165] hover:text-[#8C6D3F] hover:bg-[#F5EFE4] transition-colors"
                      title="Gerar imagem/cartão para compartilhar"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {/* Favorite */}
                    <button
                      id={`btn-favorite-verse-${verse.id}`}
                      onClick={() => toggleFavorite(verse.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isFav
                          ? 'text-[#D97706] hover:bg-[#FFF2D9]'
                          : 'text-[#7A7165] hover:text-[#D97706] hover:bg-[#F5EFE4]'
                      }`}
                      title={isFav ? 'Remover dos favoritos' : 'Favoritar versículo'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-12 bg-[#F6F1E8] rounded-2xl border border-[#E8DFC8] space-y-2">
            <BookOpen className="w-8 h-8 text-[#998A77] mx-auto" />
            <p className="font-semibold text-[#4A4032]">Nenhum versículo encontrado</p>
            <p className="text-xs text-[#7A7165]">
              Tente buscar por outro termo ou selecione a categoria "Todos".
            </p>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {activeModalVerse && (
        <ShareVerseModal
          reference={activeModalVerse.reference}
          text={activeModalVerse.text}
          themeName={activeModalVerse.theme}
          isOpen={!!activeModalVerse}
          onClose={() => setActiveModalVerse(null)}
        />
      )}
    </div>
  );
};
