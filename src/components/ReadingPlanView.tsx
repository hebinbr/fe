import React, { useState } from 'react';
import {
  BookmarkCheck,
  CheckCircle2,
  BookOpen,
  Calendar,
  Volume2,
  Square,
  Sparkles,
  ArrowRight,
  ChevronRight,
  X,
  Clock,
  Award
} from 'lucide-react';
import { ReadingPlan, ReadingPlanDay, UserPreferences } from '../types';
import { READING_PLANS_DATA } from '../data/readingPlansData';
import { devotionalTTS, soundSynthesizer, TTSState } from '../utils/audioEngine';

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

  const completedDays = preferences.planProgress[activePlan.id] || [];
  const percentComplete = Math.round((completedDays.length / activePlan.totalDays) * 100);

  // Reading Modal state
  const [selectedDayToRead, setSelectedDayToRead] = useState<ReadingPlanDay | null>(null);

  const handleSelectPlan = (planId: string) => {
    onUpdatePreferences({ activePlanId: planId });
  };

  const handleToggleDayComplete = (dayNumber: number) => {
    const isDone = completedDays.includes(dayNumber);
    const updated = isDone
      ? completedDays.filter((d) => d !== dayNumber)
      : [...completedDays, dayNumber];

    if (!isDone) {
      soundSynthesizer.playChime();
    }

    onUpdatePreferences({
      planProgress: {
        ...preferences.planProgress,
        [activePlan.id]: updated,
      },
    });
  };

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

  return (
    <div id="reading-plan-view" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Plans Switcher Bar */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#8C6D3F]">
          Escolha seu Plano de Leitura
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  <span className="text-xs font-semibold text-[#6E6354]">
                    {planPercent}%
                  </span>
                </div>
                <div>
                  <h4 className="font-serif-devotional font-bold text-base text-[#2E281F]">
                    {plan.title}
                  </h4>
                  <p className="text-xs text-[#7A7165] line-clamp-1 mt-0.5">
                    {plan.totalDays} dias • {plan.estimatedMinutesPerDay} min/dia
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Plan Dashboard Card */}
      <div
        id="active-plan-banner"
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#F5EFE4] via-[#EDE2D0] to-[#E3D4BD] border border-[#DCCEBA] shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookmarkCheck className="w-5 h-5 text-[#8C6D3F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5532]">
                Plano em Andamento
              </span>
            </div>
            <h2 className="font-serif-devotional text-2xl sm:text-3xl font-bold text-[#2E2419]">
              {activePlan.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#6C5E4C] mt-1 max-w-xl leading-relaxed">
              {activePlan.description}
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xs p-4 rounded-2xl border border-white/40">
            <div className="text-center px-2">
              <span className="block text-2xl font-bold font-serif-devotional text-[#2B2319]">
                {completedDays.length}
              </span>
              <span className="text-[11px] font-medium text-[#7A6F60] uppercase">
                Concluídos
              </span>
            </div>
            <div className="w-px h-8 bg-[#D6C7B2]" />
            <div className="text-center px-2">
              <span className="block text-2xl font-bold font-serif-devotional text-[#8C6D3F]">
                {activePlan.totalDays - completedDays.length}
              </span>
              <span className="text-[11px] font-medium text-[#7A6F60] uppercase">
                Restantes
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5B4E3C]">
            <span>Progresso Geral da Leitura</span>
            <span>{percentComplete}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#DFD2BF] overflow-hidden">
            <div
              id="plan-progress-fill"
              className="h-full bg-gradient-to-r from-[#8C6D3F] to-[#5C4524] rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily Checklist Grid */}
      <div className="space-y-4">
        <h3 className="font-serif-devotional text-xl font-bold text-[#2B2319]">
          Roteiro Diário de Capítulos
        </h3>

        <div className="space-y-3">
          {activePlan.days.map((day) => {
            const isCompleted = completedDays.includes(day.day);

            return (
              <div
                key={day.day}
                id={`reading-day-row-${day.day}`}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-[#F2F7F3] border-[#CDE1D1]'
                    : 'bg-[#FFFDFB] border-[#E8E1D5] hover:border-[#D6C7B2]'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <button
                    id={`btn-check-day-${day.day}`}
                    onClick={() => handleToggleDayComplete(day.day)}
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-colors shrink-0 mt-0.5 sm:mt-0 ${
                      isCompleted
                        ? 'bg-[#2D6A3E] border-[#2D6A3E] text-white'
                        : 'border-[#D1C4B0] bg-white text-transparent hover:border-[#8C6D3F]'
                    }`}
                    title={isCompleted ? 'Desmarcar dia' : 'Marcar como lido'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#8C6D3F]">
                        Dia {day.day}
                      </span>
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
                    <p className="text-xs text-[#7A7165] line-clamp-1 italic">
                      ✦ {day.devotionalInsight}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    id={`btn-open-reader-day-${day.day}`}
                    onClick={() => setSelectedDayToRead(day)}
                    className="px-4 py-2 rounded-xl border border-[#D9CEBF] bg-[#FAF8F5] hover:bg-[#EFE9DF] text-xs font-semibold text-[#473B2A] flex items-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#8C6D3F]" />
                    <span>Ler Passagem</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
                  handleToggleDayComplete(selectedDayToRead.day);
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
