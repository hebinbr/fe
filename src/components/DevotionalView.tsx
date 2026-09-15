import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Volume2,
  VolumeX,
  Share2,
  CheckCircle2,
  BookOpen,
  Heart,
  ChevronLeft,
  ChevronRight,
  PenTool,
  Sparkles,
  Play,
  Square,
  Bookmark,
  HeartHandshake
} from 'lucide-react';
import { Devotional, UserPreferences } from '../types';
import { DEVOTIONALS_DATA } from '../data/devotionalsData';
import { devotionalTTS, soundSynthesizer, TTSState } from '../utils/audioEngine';
import { ShareVerseModal } from './ShareVerseModal';

interface DevotionalViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  ttsState: TTSState;
  onStartMeditationSound: (type: 'pad' | 'rain') => void;
  isAmbientPlaying: boolean;
  onToggleAmbient: () => void;
  onOpenPrayerJournal?: () => void;
}

export const DevotionalView: React.FC<DevotionalViewProps> = ({
  preferences,
  onUpdatePreferences,
  ttsState,
  onStartMeditationSound,
  isAmbientPlaying,
  onToggleAmbient,
  onOpenPrayerJournal,
}) => {
  const [selectedDevotionalIndex, setSelectedDevotionalIndex] = useState(0);
  const currentDevotional = DEVOTIONALS_DATA[selectedDevotionalIndex] || DEVOTIONALS_DATA[0];
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showCompletedToast, setShowCompletedToast] = useState(false);

  // Journal note state for this devotional
  const currentNote = preferences.journalNotes[currentDevotional.id] || '';

  const isCompleted = preferences.completedDevotionals.includes(currentDevotional.id);
  const isBookmarked = preferences.bookmarkedDevotionals.includes(currentDevotional.id);

  const handleToggleComplete = () => {
    const alreadyCompleted = preferences.completedDevotionals.includes(currentDevotional.id);
    let updatedCompleted: string[];
    let newStreak = preferences.streakDays;

    if (alreadyCompleted) {
      updatedCompleted = preferences.completedDevotionals.filter((id) => id !== currentDevotional.id);
    } else {
      updatedCompleted = [...preferences.completedDevotionals, currentDevotional.id];
      // Increment streak if not completed today
      newStreak += 1;
      setShowCompletedToast(true);
      soundSynthesizer.playChime();
      setTimeout(() => setShowCompletedToast(false), 4000);
    }

    onUpdatePreferences({
      completedDevotionals: updatedCompleted,
      streakDays: newStreak,
    });
  };

  const handleToggleBookmark = () => {
    const updated = isBookmarked
      ? preferences.bookmarkedDevotionals.filter((id) => id !== currentDevotional.id)
      : [...preferences.bookmarkedDevotionals, currentDevotional.id];
    onUpdatePreferences({ bookmarkedDevotionals: updated });
  };

  const handleSaveNote = (text: string) => {
    onUpdatePreferences({
      journalNotes: {
        ...preferences.journalNotes,
        [currentDevotional.id]: text,
      },
    });
  };

  const handleToggleReadAloud = () => {
    if (ttsState.isSpeaking) {
      devotionalTTS.stop();
    } else {
      const fullContent = [
        currentDevotional.title,
        `Versículo Chave: ${currentDevotional.keyVerse.reference}. ${currentDevotional.keyVerse.text}`,
        ...currentDevotional.reflection,
        `Aplicação prática: ${currentDevotional.practicalAction}`,
        `Oração do dia: ${currentDevotional.prayer}`
      ];
      devotionalTTS.speak(currentDevotional.title, fullContent);
    }
  };

  // Font size classes
  const fontSizes = {
    normal: {
      body: 'text-base leading-relaxed',
      verse: 'text-lg sm:text-xl leading-relaxed',
      title: 'text-2xl sm:text-3xl',
    },
    large: {
      body: 'text-lg leading-relaxed',
      verse: 'text-xl sm:text-2xl leading-relaxed',
      title: 'text-3xl sm:text-4xl',
    },
    xlarge: {
      body: 'text-xl leading-loose',
      verse: 'text-2xl sm:text-3xl leading-loose',
      title: 'text-4xl sm:text-5xl',
    },
  }[preferences.fontSize];

  return (
    <div id="devotional-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Toast Confirmation */}
      {showCompletedToast && (
        <div
          id="toast-devotional-completed"
          className="fixed top-20 right-4 z-50 bg-[#2D5A3A] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-[#3E744E] flex items-center gap-3 animate-bounce"
        >
          <Sparkles className="w-5 h-5 text-[#F3DFC1]" />
          <div>
            <p className="font-semibold text-sm">Devocional Concluído com Sucesso!</p>
            <p className="text-xs text-[#E1EFE4]">Constância espiritual renovada (+1 dia de sequência)</p>
          </div>
        </div>
      )}

      {/* Date & Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E1D5]">
        <div className="flex items-center gap-2">
          <button
            id="btn-prev-devotional"
            onClick={() => setSelectedDevotionalIndex((prev) => Math.max(0, prev - 1))}
            disabled={selectedDevotionalIndex === 0}
            className="p-2 rounded-xl border border-[#E2D8C9] bg-[#FAF8F5] text-[#554D41] hover:bg-[#EFE9DF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Devocional anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EFE9DF] text-[#4A4235] text-xs font-semibold">
            <Calendar className="w-4 h-4 text-[#8C6D3F]" />
            <span>
              {new Intl.DateTimeFormat('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }).format(new Date(currentDevotional.date + 'T12:00:00'))}
            </span>
          </div>

          <button
            id="btn-next-devotional"
            onClick={() =>
              setSelectedDevotionalIndex((prev) => Math.min(DEVOTIONALS_DATA.length - 1, prev + 1))
            }
            disabled={selectedDevotionalIndex === DEVOTIONALS_DATA.length - 1}
            className="p-2 rounded-xl border border-[#E2D8C9] bg-[#FAF8F5] text-[#554D41] hover:bg-[#EFE9DF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Próximo devocional"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Audio Narration & Ambient Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            id="btn-toggle-narration"
            onClick={handleToggleReadAloud}
            className={`px-3.5 py-2 rounded-xl font-medium text-xs flex items-center gap-2 transition-all ${
              ttsState.isSpeaking
                ? 'bg-[#C2410C] text-white shadow-xs'
                : 'bg-[#8C6D3F] hover:bg-[#785C32] text-white shadow-sm'
            }`}
          >
            {ttsState.isSpeaking ? (
              <>
                <Square className="w-3.5 h-3.5" />
                <span>Pausar Narração</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Ouvir Devocional</span>
              </>
            )}
          </button>

          <button
            id="btn-toggle-ambient-sound"
            onClick={() => {
              if (isAmbientPlaying) {
                onToggleAmbient();
              } else {
                onStartMeditationSound('pad');
              }
            }}
            title="Som ambiente de oração"
            className={`p-2 rounded-xl border transition-colors ${
              isAmbientPlaying
                ? 'bg-[#E3EFE6] border-[#BCD8C3] text-[#22502E]'
                : 'border-[#E2D8C9] bg-[#FAF8F5] text-[#6C6356] hover:bg-[#EFE9DF]'
            }`}
          >
            {isAmbientPlaying ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold px-1">
                <Volume2 className="w-3.5 h-3.5 text-[#22502E]" />
                <span className="hidden md:inline">Ambiente Ativo</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold px-1">
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden md:inline">+ Som Suave</span>
              </span>
            )}
          </button>

          <button
            id="btn-bookmark-devotional"
            onClick={handleToggleBookmark}
            title={isBookmarked ? 'Remover dos salvos' : 'Salvar nos favoritos'}
            className={`p-2 rounded-xl border transition-colors ${
              isBookmarked
                ? 'bg-[#FFF2D9] border-[#F4D293] text-[#A66E14]'
                : 'border-[#E2D8C9] bg-[#FAF8F5] text-[#6C6356] hover:bg-[#EFE9DF]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Devotional Hero Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-[#E8DFC8] text-[#554425]">
            {currentDevotional.theme}
          </span>
          <span className="text-xs text-[#82796D] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {currentDevotional.readTimeMinutes} min de leitura
          </span>
        </div>

        <h1
          id="devotional-title"
          className={`font-serif-devotional font-bold tracking-tight text-[#2B2319] ${fontSizes.title}`}
        >
          {currentDevotional.title}
        </h1>
        <p className="text-base sm:text-lg text-[#6B5F4F] font-normal italic">
          {currentDevotional.subtitle}
        </p>
      </div>

      {/* Key Scripture Passage Box */}
      <div
        id="key-verse-card"
        className="p-6 sm:p-7 rounded-2xl bg-[#F6F0E6] border border-[#E8DCC9] shadow-xs relative overflow-hidden"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2D4BF]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#8C6D3F]" />
            <span className="font-semibold text-xs uppercase tracking-wider text-[#6B5A42]">
              Palavra do Dia • {currentDevotional.keyVerse.reference}
            </span>
          </div>
          <button
            id="btn-share-verse"
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-[#735A33] hover:text-[#42321B] px-2.5 py-1 rounded-lg hover:bg-[#EAE0D0] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartilhar</span>
          </button>
        </div>

        <blockquote className={`font-serif-devotional text-[#2E281F] italic font-medium ${fontSizes.verse}`}>
          "{currentDevotional.keyVerse.text}"
        </blockquote>
      </div>

      {/* Reflection Paragraphs */}
      <div id="devotional-reflection-body" className="space-y-4">
        {currentDevotional.reflection.map((para, idx) => (
          <p
            key={idx}
            className={`text-[#3A332A] font-serif-devotional ${fontSizes.body}`}
          >
            {para}
          </p>
        ))}
      </div>

      {/* Practical Action Box */}
      <div
        id="devotional-practical-action"
        className="p-5 sm:p-6 rounded-2xl bg-[#F4F7F4] border border-[#D5E4D8] space-y-2"
      >
        <div className="flex items-center gap-2 text-[#244A2F]">
          <Sparkles className="w-4 h-4 text-[#2D6A3E]" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Para Praticar Hoje
          </h3>
        </div>
        <p className="text-sm sm:text-base text-[#253D2C] leading-relaxed">
          {currentDevotional.practicalAction}
        </p>
      </div>

      {/* Guided Prayer Box */}
      <div
        id="devotional-prayer-box"
        className="p-5 sm:p-6 rounded-2xl bg-[#FFFDF8] border border-[#EADECE] shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#7C5A23]">
            <Heart className="w-4 h-4 text-[#8C6D3F]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Oração Guiada
            </h3>
          </div>
          {onOpenPrayerJournal && (
            <button
              id="btn-goto-prayer-journal"
              onClick={onOpenPrayerJournal}
              className="px-3 py-1 rounded-xl bg-[#FAF6EE] hover:bg-[#F3EDE0] text-[#7C5A23] border border-[#E5DACD] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#8C6D3F]" />
              <span>Abrir Diário de Oração</span>
            </button>
          )}
        </div>
        <p className="font-serif-devotional text-base sm:text-lg italic text-[#3F362A] leading-relaxed">
          "{currentDevotional.prayer}"
        </p>
      </div>

      {/* User Journal / Personal Notes */}
      <div
        id="devotional-journal-box"
        className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#5B5041]">
            <PenTool className="w-4 h-4 text-[#8C6D3F]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Meu Diário Espiritual (Anotações Pessoais)
            </h3>
          </div>
          <span className="text-[11px] text-[#8C8375]">Salvo automaticamente</span>
        </div>
        <textarea
          id="textarea-journal-notes"
          value={currentNote}
          onChange={(e) => handleSaveNote(e.target.value)}
          placeholder="O que Deus falou ao seu coração hoje? Escreva seus pensamentos, gratidão ou pedidos..."
          rows={3}
          className="w-full p-3.5 rounded-xl border border-[#E2D8C9] bg-white text-sm text-[#2E281F] placeholder:text-[#9E9587] focus:outline-none focus:ring-2 focus:ring-[#8C6D3F]/40 focus:border-[#8C6D3F] transition-all resize-y"
        />
      </div>

      {/* Completion Button */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E8E1D5]">
        <span className="text-xs text-[#7A7165]">
          Autor: <span className="font-medium text-[#4D4539]">{currentDevotional.author}</span>
        </span>

        <button
          id="btn-complete-devotional"
          onClick={handleToggleComplete}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm ${
            isCompleted
              ? 'bg-[#E0EFE3] text-[#1E572B] border border-[#BBDCBF]'
              : 'bg-[#8C6D3F] hover:bg-[#785C32] text-white shadow-[#8C6D3F]/20'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-[#1E572B]' : 'text-white'}`} />
          <span>{isCompleted ? 'Devocional Concluído ✓' : 'Marcar como Concluído Hoje'}</span>
        </button>
      </div>

      {/* Other Devotionals Directory */}
      <div className="pt-8 border-t border-[#E8E1D5] space-y-4">
        <h3 className="font-serif-devotional text-xl font-semibold text-[#2B2319]">
          Explore Outros Devocionais
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEVOTIONALS_DATA.map((item, index) => {
            const isItemCompleted = preferences.completedDevotionals.includes(item.id);
            const isItemActive = index === selectedDevotionalIndex;
            return (
              <div
                key={item.id}
                id={`devotional-card-${item.id}`}
                onClick={() => {
                  setSelectedDevotionalIndex(index);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isItemActive
                    ? 'border-[#8C6D3F] bg-[#F5EFE4] ring-2 ring-[#8C6D3F]/20'
                    : 'border-[#E8E1D5] bg-[#FFFDFB] hover:bg-[#FAF6EE] hover:border-[#DCCDBA]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-[#8C6D3F] uppercase tracking-wide">
                    {item.theme}
                  </span>
                  {isItemCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A3E]" />
                  )}
                </div>
                <h4 className="font-serif-devotional font-semibold text-base text-[#2E281F]">
                  {item.title}
                </h4>
                <p className="text-xs text-[#7A7165] line-clamp-1 mt-1">
                  {item.keyVerse.reference} — {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share Modal */}
      <ShareVerseModal
        reference={currentDevotional.keyVerse.reference}
        text={currentDevotional.keyVerse.text}
        themeName={currentDevotional.theme}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
};
