import React, { useState, useMemo } from 'react';
import {
  BookmarkCheck,
  CheckCircle2,
  BookOpen,
  Volume2,
  Square,
  Sparkles,
  ChevronRight,
  X,
  Target,
  Search,
  Check,
  Calendar,
  Clock,
  SlidersHorizontal,
  ChevronLeft,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ReadingPlan, ReadingPlanDay, UserPreferences, ReadingPlanGoal } from '../types';
import {
  READING_PLANS_DATA,
  getPlanGoal,
  calculateGoalStats
} from '../data/readingPlansData';
import { devotionalTTS, soundSynthesizer, TTSState } from '../utils/audioEngine';
import { ReadingGoalCustomizerModal } from './ReadingGoalCustomizerModal';

interface ReadingPlanViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  ttsState: TTSState;
}

export const ReadingPlanView: React.FC<ReadingPlanViewProps> = ({
  preferences,
  onUpdatePreferences,
  ttsState,
}) => {
  const activePlan =
    READING_PLANS_DATA.find((p) => p.id === preferences.activePlanId) ||
    READING_PLANS_DATA[0];

  const currentGoal: ReadingPlanGoal = getPlanGoal(activePlan.id, preferences);

  const completedDays = preferences.planProgress[activePlan.id] || [];
  const completedChapters = preferences.planCompletedChapters?.[activePlan.id] || [];

  // Goal calculations
  const stats = useMemo(() => {
    return calculateGoalStats(activePlan, currentGoal, completedDays, completedChapters);
  }, [activePlan, currentGoal, completedDays, completedChapters]);

  // Modal states
  const [selectedDayToRead, setSelectedDayToRead] = useState<ReadingPlanDay | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState<boolean>(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  // Change active plan
  const handleSelectPlan = (planId: string) => {
    onUpdatePreferences({ activePlanId: planId });
    setCurrentPage(1);
    setSearchQuery('');
  };

  // Save customized goal
  const handleSaveGoal = (planId: string, updatedGoal: ReadingPlanGoal) => {
    const existingGoals = preferences.planGoals || {};
    onUpdatePreferences({
      planGoals: {
        ...existingGoals,
        [planId]: updatedGoal,
      },
    });
  };

  // Toggle individual chapter
  const handleToggleChapter = (chapterName: string, day: ReadingPlanDay) => {
    const isChapterDone = completedChapters.includes(chapterName);
    const updatedChapters = isChapterDone
      ? completedChapters.filter((c) => c !== chapterName)
      : [...completedChapters, chapterName];

    if (!isChapterDone) {
      soundSynthesizer.playChime();
    }

    // Check if all chapters of this day are now completed
    const dayChapters = day.chapters || [];
    const allDayChaptersCompleted = dayChapters.length > 0 && dayChapters.every((c) => updatedChapters.includes(c));

    let updatedDays = [...completedDays];
    if (allDayChaptersCompleted && !completedDays.includes(day.day)) {
      updatedDays.push(day.day);
    } else if (!allDayChaptersCompleted && completedDays.includes(day.day)) {
      updatedDays = updatedDays.filter((d) => d !== day.day);
    }

    onUpdatePreferences({
      planCompletedChapters: {
        ...(preferences.planCompletedChapters || {}),
        [activePlan.id]: updatedChapters,
      },
      planProgress: {
        ...preferences.planProgress,
        [activePlan.id]: updatedDays,
      },
    });
  };

  // Toggle entire day
  const handleToggleDayComplete = (day: ReadingPlanDay) => {
    const isDayDone = completedDays.includes(day.day);
    const dayChapters = day.chapters || [];

    let updatedDays: number[];
    let updatedChapters = [...completedChapters];

    if (isDayDone) {
      // Uncheck day and its chapters
      updatedDays = completedDays.filter((d) => d !== day.day);
      updatedChapters = updatedChapters.filter((ch) => !dayChapters.includes(ch));
    } else {
      // Check day and all its chapters
      updatedDays = [...completedDays, day.day];
      for (const ch of dayChapters) {
        if (!updatedChapters.includes(ch)) {
          updatedChapters.push(ch);
        }
      }
      soundSynthesizer.playChime();
    }

    onUpdatePreferences({
      planProgress: {
        ...preferences.planProgress,
        [activePlan.id]: updatedDays,
      },
      planCompletedChapters: {
        ...(preferences.planCompletedChapters || {}),
        [activePlan.id]: updatedChapters,
      },
    });
  };

  // Speak passages using TTS
  const handleSpeakPassages = (day: ReadingPlanDay) => {
    if (ttsState.isSpeaking) {
      devotionalTTS.stop();
    } else {
      const parts = [
        `Dia ${day.day}: ${day.title}`,
        ...day.passages.map((p) => `${p.reference}. ${p.text}`),
        `Reflexão: ${day.devotionalInsight}`
      ];
      devotionalTTS.speak(`Leitura Bíblica • Dia ${day.day}`, parts);
    }
  };

  // Filtered days
  const filteredDays = useMemo(() => {
    return activePlan.days.filter((day) => {
      const isDayDone = completedDays.includes(day.day);

      // Status filter
      if (statusFilter === 'pending' && isDayDone) return false;
      if (statusFilter === 'completed' && !isDayDone) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = day.title.toLowerCase().includes(q);
        const matchesInsight = day.devotionalInsight.toLowerCase().includes(q);
        const matchesPassage = day.passages.some(
          (p) => p.reference.toLowerCase().includes(q) || p.text.toLowerCase().includes(q)
        );
        const matchesChapter = day.chapters?.some((ch) => ch.toLowerCase().includes(q));
        const matchesDayNum = `dia ${day.day}`.includes(q) || String(day.day) === q;

        return matchesTitle || matchesInsight || matchesPassage || matchesChapter || matchesDayNum;
      }

      return true;
    });
  }, [activePlan.days, completedDays, statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredDays.length / itemsPerPage));
  const displayedDays = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDays.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDays, currentPage, itemsPerPage]);

  // Jump to first uncompleted day
  const handleJumpToNextPending = () => {
    const firstPending = activePlan.days.find((d) => !completedDays.includes(d.day));
    if (firstPending) {
      setStatusFilter('all');
      setSearchQuery('');
      const dayIndex = activePlan.days.findIndex((d) => d.day === firstPending.day);
      const targetPage = Math.floor(dayIndex / itemsPerPage) + 1;
      setCurrentPage(targetPage);

      setTimeout(() => {
        const el = document.getElementById(`reading-day-row-${firstPending.day}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  return (
    <div id="reading-plan-view" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Plans Switcher Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#8C6D3F] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Escolha seu Plano de Leitura Bíblica</span>
          </label>
          <button
            id="btn-open-customizer-top"
            onClick={() => setIsGoalModalOpen(true)}
            className="text-xs font-semibold text-[#8C6D3F] hover:text-[#654E2C] flex items-center gap-1 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Personalizar Metas</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {READING_PLANS_DATA.map((plan) => {
            const isCurrent = plan.id === activePlan.id;
            const planCompletedCount = (preferences.planProgress[plan.id] || []).length;
            const planPercent = Math.round((planCompletedCount / plan.totalDays) * 100);

            return (
              <div
                key={plan.id}
                id={`plan-switch-${plan.id}`}
                onClick={() => handleSelectPlan(plan.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  isCurrent
                    ? 'bg-[#F5EFE5] border-[#8C6D3F] ring-2 ring-[#8C6D3F]/20 shadow-xs'
                    : 'bg-[#FFFDFB] border-[#E8E1D5] hover:bg-[#FAF6ED] hover:border-[#D8C9B4]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#8C6D3F] uppercase">
                    {plan.category}
                  </span>
                  <span className="text-xs font-semibold text-[#6E6354] bg-white/70 px-2 py-0.5 rounded-md border border-[#E8E1D5]">
                    {planPercent}%
                  </span>
                </div>
                <div>
                  <h4 className="font-serif-devotional font-bold text-base text-[#2E281F]">
                    {plan.title}
                  </h4>
                  <p className="text-xs text-[#7A7165] line-clamp-1 mt-0.5">
                    {plan.totalDays} dias • {plan.totalChapters} capítulos
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Plan Dashboard Banner */}
      <div
        id="active-plan-banner"
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#F6F0E6] via-[#EFE5D5] to-[#E5D7C2] border border-[#DCCEBA] shadow-sm space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#8C6D3F]/15 text-[#6B522F] border border-[#8C6D3F]/20">
                <BookmarkCheck className="w-3.5 h-3.5 text-[#8C6D3F]" />
                {activePlan.category}
              </span>

              {/* Goal Mode Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/80 text-[#544736] border border-[#DDD1BE]">
                <Target className="w-3.5 h-3.5 text-[#8C6D3F]" />
                <span>
                  Meta: {currentGoal.targetChapters} caps/{currentGoal.type === 'daily' ? 'dia' : 'sem'} • {currentGoal.readingDaysPerWeek}d/sem
                </span>
              </span>
            </div>

            <h2 className="font-serif-devotional text-2xl sm:text-3xl font-bold text-[#2E2419]">
              {activePlan.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#6C5E4C] max-w-xl leading-relaxed">
              {activePlan.description}
            </p>

            {currentGoal.customNotes && (
              <p className="text-xs italic text-[#7A6A55] bg-white/50 px-3 py-1.5 rounded-xl border border-[#E0D2C0] inline-block">
                “{currentGoal.customNotes}”
              </p>
            )}
          </div>

          {/* Quick Action: Customize Plan & Goal */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <button
              id="btn-open-goal-customizer"
              type="button"
              onClick={() => setIsGoalModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#8C6D3F] hover:bg-[#785C32] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Personalizar Meta & Ritmo</span>
            </button>

            <button
              id="btn-jump-next-pending"
              type="button"
              onClick={handleJumpToNextPending}
              className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white border border-[#D9CABE] text-xs font-semibold text-[#5B4D3C] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Continuar Leitura</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/70 border border-white/60 shadow-2xs">
            <span className="block text-[11px] font-bold text-[#8C6D3F] uppercase tracking-wider">
              Capítulos Lidos
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-bold font-serif-devotional text-[#2B2319]">
                {stats.totalCompletedChapters}
              </span>
              <span className="text-xs text-[#7A6F60]">/ {stats.totalChapters}</span>
            </div>
            <span className="text-[10px] text-[#8A7C6B] font-medium">
              {stats.chapterPercent}% concluído
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 border border-white/60 shadow-2xs">
            <span className="block text-[11px] font-bold text-[#8C6D3F] uppercase tracking-wider">
              Dias Feitos
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-bold font-serif-devotional text-[#2B2319]">
                {completedDays.length}
              </span>
              <span className="text-xs text-[#7A6F60]">/ {activePlan.totalDays}</span>
            </div>
            <span className="text-[10px] text-[#8A7C6B] font-medium">
              {activePlan.totalDays - completedDays.length} restantes
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 border border-white/60 shadow-2xs">
            <span className="block text-[11px] font-bold text-[#8C6D3F] uppercase tracking-wider">
              Ritmo de Leitura
            </span>
            <div className="text-base sm:text-lg font-bold font-serif-devotional text-[#2B2319] mt-0.5">
              ~{stats.dailyTargetChapters} caps/dia
            </div>
            <span className="text-[10px] text-[#8A7C6B] font-medium">
              {currentGoal.type === 'weekly' ? `${currentGoal.targetChapters} caps/semana` : 'Meta diária ativa'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 border border-white/60 shadow-2xs">
            <span className="block text-[11px] font-bold text-[#8C6D3F] uppercase tracking-wider">
              Previsão de Término
            </span>
            <div className="text-sm font-bold text-[#2B2319] mt-1 line-clamp-1">
              {stats.estimatedFinishDate}
            </div>
            <span className="text-[10px] text-[#8A7C6B] font-medium">
              ~{stats.daysToFinish} dias em ritmo
            </span>
          </div>
        </div>

        {/* Dual Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5B4E3C]">
            <span>Progresso da Leitura Bíblica</span>
            <span>{stats.chapterPercent}% dos Capítulos ({stats.dayPercent}% dos Dias)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#DED1BE] overflow-hidden">
            <div
              id="plan-chapter-progress-fill"
              className="h-full bg-gradient-to-r from-[#8C6D3F] to-[#4F3B1F] rounded-full transition-all duration-500"
              style={{ width: `${stats.chapterPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-serif-devotional text-xl font-bold text-[#2B2319] flex items-center gap-2">
            <span>Roteiro de Leitura & Capítulos</span>
            <span className="text-xs font-sans font-semibold text-[#8C6D3F] bg-[#FAF0DE] px-2.5 py-0.5 rounded-full border border-[#EADBCC]">
              {filteredDays.length} {filteredDays.length === 1 ? 'dia' : 'dias'}
            </span>
          </h3>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-[#9C8F7E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-bible-plan"
              type="text"
              placeholder="Buscar livro, capítulo ou dia..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#D9CABE] text-xs text-[#3D3325] focus:outline-none focus:ring-2 focus:ring-[#8C6D3F]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9C8F7E] hover:text-[#4A3E31]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8E1D5] pb-2">
          <button
            id="filter-plan-all"
            type="button"
            onClick={() => {
              setStatusFilter('all');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-[#8C6D3F] text-white shadow-2xs'
                : 'text-[#6E6354] hover:bg-[#F2ECE1]'
            }`}
          >
            Todos ({activePlan.days.length})
          </button>
          <button
            id="filter-plan-pending"
            type="button"
            onClick={() => {
              setStatusFilter('pending');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'pending'
                ? 'bg-[#8C6D3F] text-white shadow-2xs'
                : 'text-[#6E6354] hover:bg-[#F2ECE1]'
            }`}
          >
            Pendentes ({activePlan.days.length - completedDays.length})
          </button>
          <button
            id="filter-plan-completed"
            type="button"
            onClick={() => {
              setStatusFilter('completed');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'completed'
                ? 'bg-[#8C6D3F] text-white shadow-2xs'
                : 'text-[#6E6354] hover:bg-[#F2ECE1]'
            }`}
          >
            Concluídos ({completedDays.length})
          </button>
        </div>

        {/* Daily Checklist Grid with Granular Chapter Toggling */}
        {displayedDays.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white border border-[#E8E1D5] space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-[#A09382]" />
            <p className="text-sm font-semibold text-[#4A3F31]">Nenhum dia encontrado para este filtro.</p>
            <p className="text-xs text-[#8A7C6B]">Tente limpar o termo de busca ou alterar os filtros.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedDays.map((day) => {
              const isCompleted = completedDays.includes(day.day);
              const dayChapters = day.chapters || [];
              const dayCompletedChaptersCount = dayChapters.filter((ch) => completedChapters.includes(ch)).length;
              const isPartiallyRead = dayCompletedChaptersCount > 0 && dayCompletedChaptersCount < dayChapters.length;

              return (
                <div
                  key={day.day}
                  id={`reading-day-row-${day.day}`}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                    isCompleted
                      ? 'bg-[#F2F7F3] border-[#CDE1D1]'
                      : isPartiallyRead
                      ? 'bg-[#FCF9F2] border-[#E8DFC9]'
                      : 'bg-[#FFFDFB] border-[#E8E1D5] hover:border-[#D6C7B2]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3.5">
                      {/* Day master check button */}
                      <button
                        id={`btn-check-day-${day.day}`}
                        onClick={() => handleToggleDayComplete(day)}
                        className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-colors shrink-0 mt-0.5 sm:mt-0 ${
                          isCompleted
                            ? 'bg-[#2D6A3E] border-[#2D6A3E] text-white'
                            : isPartiallyRead
                            ? 'border-[#C29548] bg-[#FAF1DF] text-[#8C6D3F]'
                            : 'border-[#D1C4B0] bg-white text-transparent hover:border-[#8C6D3F]'
                        }`}
                        title={isCompleted ? 'Desmarcar dia inteiro' : 'Marcar todos os capítulos do dia como lidos'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-[#8C6D3F]">
                            Dia {day.day}
                          </span>
                          {day.week && (
                            <span className="text-[11px] font-medium text-[#8E8373] bg-[#EFE8DC] px-2 py-0.2 rounded-md">
                              Semana {day.week}
                            </span>
                          )}
                          <span className="text-xs text-[#8E8373]">•</span>
                          <span className="text-xs font-semibold text-[#4F4638]">
                            {day.passages.map((p) => p.reference).join(', ')}
                          </span>
                        </div>
                        <h4
                          className={`font-serif-devotional font-semibold text-base ${
                            isCompleted ? 'line-through text-[#6F7C72]' : 'text-[#2E281F]'
                          }`}
                        >
                          {day.title}
                        </h4>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {dayChapters.length > 0 && (
                        <span className="text-[11px] font-semibold text-[#735A34] bg-[#FAF2E3] px-2.5 py-1 rounded-lg border border-[#E9DFC8]">
                          {dayCompletedChaptersCount}/{dayChapters.length} caps
                        </span>
                      )}

                      <button
                        id={`btn-open-reader-day-${day.day}`}
                        onClick={() => setSelectedDayToRead(day)}
                        className="px-3.5 py-1.5 rounded-xl border border-[#D9CEBF] bg-[#FAF8F5] hover:bg-[#EFE9DF] text-xs font-semibold text-[#473B2A] flex items-center gap-1.5 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#8C6D3F]" />
                        <span>Ler Passagem</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Granular Chapters Checkbox Chips */}
                  {dayChapters.length > 0 && (
                    <div className="pt-2 border-t border-[#EDE6DC] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A6A55]">
                          Marcar Capítulos Individuais Como Lidos:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleDayComplete(day)}
                          className="text-[11px] font-semibold text-[#8C6D3F] hover:underline"
                        >
                          {isCompleted ? 'Desmarcar todos' : 'Marcar todos lidos'}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {dayChapters.map((chapterName) => {
                          const isChDone = completedChapters.includes(chapterName);
                          return (
                            <button
                              key={chapterName}
                              id={`btn-ch-${day.day}-${chapterName.replace(/\s+/g, '-').toLowerCase()}`}
                              type="button"
                              onClick={() => handleToggleChapter(chapterName, day)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                                isChDone
                                  ? 'bg-[#E1EFE3] text-[#1E5C2D] border-[#B9DCBF]'
                                  : 'bg-white text-[#4A3E31] border-[#DDD0C0] hover:bg-[#FAF6EE]'
                              }`}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                                  isChDone ? 'bg-[#2D6A3E] border-[#2D6A3E] text-white' : 'border-[#A39583]'
                                }`}
                              >
                                {isChDone && <Check className="w-2.5 h-2.5" />}
                              </div>
                              <span className={isChDone ? 'line-through opacity-85' : ''}>
                                {chapterName}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Devotional Insight Snippet */}
                  <p className="text-xs text-[#7A7165] italic line-clamp-1">
                    ✦ {day.devotionalInsight}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-[#E8E1D5]">
            <div className="text-xs text-[#7A6F60]">
              Página {currentPage} de {totalPages} ({filteredDays.length} dias no total)
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-prev-page"
                type="button"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                  currentPage === 1
                    ? 'border-[#E8E1D5] text-[#B0A595] cursor-not-allowed'
                    : 'border-[#D9CEBF] bg-white text-[#473B2A] hover:bg-[#EFE9DF]'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {/* Page Number Quick Selector */}
              <select
                id="select-bible-plan-page"
                value={currentPage}
                onChange={(e) => {
                  setCurrentPage(Number(e.target.value));
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="py-1.5 px-3 rounded-xl border border-[#D9CEBF] bg-white text-xs font-semibold text-[#473B2A] focus:outline-none focus:ring-2 focus:ring-[#8C6D3F]"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    Pág. {num}
                  </option>
                ))}
              </select>

              <button
                id="btn-next-page"
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                  currentPage === totalPages
                    ? 'border-[#E8E1D5] text-[#B0A595] cursor-not-allowed'
                    : 'border-[#D9CEBF] bg-white text-[#473B2A] hover:bg-[#EFE9DF]'
                }`}
              >
                <span className="hidden sm:inline">Próxima</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Goal Customizer Modal */}
      <ReadingGoalCustomizerModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        activePlan={activePlan}
        currentGoal={currentGoal}
        onSaveGoal={handleSaveGoal}
        onSelectPlan={handleSelectPlan}
      />

      {/* Integrated Bible Reader Modal */}
      {selectedDayToRead && (
        <div
          id="bible-reader-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setSelectedDayToRead(null)}
        >
          <div
            id="bible-reader-modal-content"
            className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full border border-[#E8E1D5] shadow-2xl p-6 sm:p-8 max-h-[88vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D5]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D3F]">
                  Plano: {activePlan.title} • Dia {selectedDayToRead.day}
                </span>
                <h3 className="font-serif-devotional text-2xl font-bold text-[#2B2319]">
                  {selectedDayToRead.title}
                </h3>
              </div>
              <button
                id="btn-close-reader-modal"
                onClick={() => setSelectedDayToRead(null)}
                className="p-2 rounded-xl text-[#7A7165] hover:text-[#2B2620] hover:bg-[#EFE9DF] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Audio narration button inside reader */}
            <div className="flex items-center justify-between bg-[#F4EFE6] p-3.5 rounded-2xl border border-[#E2D8C9]">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#8C6D3F]" />
                <span className="text-xs font-semibold text-[#4D4233]">
                  Ouvir Leitura Bíblica em Áudio
                </span>
              </div>
              <button
                id="btn-speak-reader-modal"
                onClick={() => handleSpeakPassages(selectedDayToRead)}
                className="px-3 py-1.5 rounded-xl bg-[#8C6D3F] hover:bg-[#785C32] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {ttsState.isSpeaking ? (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>Pausar Áudio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Ouvir Voz</span>
                  </>
                )}
              </button>
            </div>

            {/* Granular Chapter Toggles inside Modal */}
            {selectedDayToRead.chapters && selectedDayToRead.chapters.length > 0 && (
              <div className="p-4 rounded-2xl bg-white border border-[#E8E1D5] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#735A34]">
                  Capítulos Deste Dia:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedDayToRead.chapters.map((ch) => {
                    const isDone = completedChapters.includes(ch);
                    return (
                      <button
                        key={ch}
                        id={`btn-reader-ch-${ch.replace(/\s+/g, '-').toLowerCase()}`}
                        type="button"
                        onClick={() => handleToggleChapter(ch, selectedDayToRead)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          isDone
                            ? 'bg-[#E1EFE3] text-[#1E5C2D] border-[#B9DCBF]'
                            : 'bg-[#FAF8F5] text-[#4A3E31] border-[#DDD0C0] hover:bg-[#FAF6EE]'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                            isDone ? 'bg-[#2D6A3E] border-[#2D6A3E] text-white' : 'border-[#A39583]'
                          }`}
                        >
                          {isDone && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className={isDone ? 'line-through opacity-85' : ''}>{ch}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Scripture Passage Texts */}
            <div className="space-y-6">
              {selectedDayToRead.passages.map((passage, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-[#FFFDFB] border border-[#E8E1D5] space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-2">
                    <span className="font-semibold text-sm text-[#8C6D3F]">
                      📖 {passage.reference}
                    </span>
                    <span className="text-xs text-[#9E9385]">Texto Bíblico</span>
                  </div>
                  <p className="font-serif-devotional text-base sm:text-lg leading-relaxed text-[#352D23]">
                    {passage.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Devotional Insight Box */}
            <div className="p-5 rounded-2xl bg-[#F6EFE5] border border-[#E0D0BB] space-y-1.5">
              <div className="flex items-center gap-2 text-[#6D5531]">
                <Sparkles className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Reflexão & Aplicação
                </h4>
              </div>
              <p className="font-serif-devotional text-sm sm:text-base text-[#3A3022] italic">
                "{selectedDayToRead.devotionalInsight}"
              </p>
            </div>

            {/* Actions: Complete Day */}
            <div className="pt-4 border-t border-[#E8E1D5] flex items-center justify-between gap-3">
              <button
                id="btn-close-reader-bottom"
                onClick={() => setSelectedDayToRead(null)}
                className="px-4 py-2.5 rounded-xl border border-[#D9CEBF] text-xs font-medium text-[#594E3F] hover:bg-[#EFE9DF] transition-colors"
              >
                Fechar Leitor
              </button>

              <button
                id="btn-mark-reader-complete"
                onClick={() => {
                  handleToggleDayComplete(selectedDayToRead);
                  setSelectedDayToRead(null);
                }}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all ${
                  completedDays.includes(selectedDayToRead.day)
                    ? 'bg-[#E1EFE3] text-[#1D5E2D] border border-[#BCDDC3]'
                    : 'bg-[#8C6D3F] hover:bg-[#785C32] text-white shadow-sm'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedDays.includes(selectedDayToRead.day)
                    ? 'Dia Já Concluído ✓'
                    : 'Concluir Leitura do Dia'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
