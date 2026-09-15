import React, { useState } from 'react';
import {
  X,
  Target,
  Calendar,
  Clock,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { ReadingPlan, ReadingPlanGoal } from '../types';
import { READING_PLANS_DATA } from '../data/readingPlansData';
import { soundSynthesizer } from '../utils/audioEngine';

interface ReadingGoalCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePlan: ReadingPlan;
  currentGoal: ReadingPlanGoal;
  onSaveGoal: (planId: string, updatedGoal: ReadingPlanGoal) => void;
  onSelectPlan?: (planId: string) => void;
}

export const ReadingGoalCustomizerModal: React.FC<ReadingGoalCustomizerModalProps> = ({
  isOpen,
  onClose,
  activePlan,
  currentGoal,
  onSaveGoal,
  onSelectPlan
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(activePlan.id);
  const [goalType, setGoalType] = useState<'daily' | 'weekly'>(currentGoal.type || 'daily');
  const [targetChapters, setTargetChapters] = useState<number>(currentGoal.targetChapters || 3);
  const [readingDaysPerWeek, setReadingDaysPerWeek] = useState<number>(currentGoal.readingDaysPerWeek || 7);
  const [startDate, setStartDate] = useState<string>(currentGoal.startDate || new Date().toISOString().split('T')[0]);
  const [reminderTime, setReminderTime] = useState<string>(currentGoal.reminderTime || '07:00');
  const [customNotes, setCustomNotes] = useState<string>(currentGoal.customNotes || '');

  if (!isOpen) return null;

  const currentSelectedPlan = READING_PLANS_DATA.find((p) => p.id === selectedPlanId) || activePlan;
  const totalChapters = currentSelectedPlan.totalChapters || currentSelectedPlan.days.length * 3;

  // Real-time calculation of completion pace
  let effectiveChaptersPerDay = targetChapters;
  if (goalType === 'weekly') {
    effectiveChaptersPerDay = Math.max(1, Math.round((targetChapters / readingDaysPerWeek) * 10) / 10);
  }

  const daysNeeded = Math.ceil(totalChapters / (effectiveChaptersPerDay || 1));
  const estimatedEndDate = new Date(new Date(startDate).getTime() + daysNeeded * 24 * 60 * 60 * 1000);
  const formattedEndDate = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(estimatedEndDate);

  const estimatedMinutesPerDay = Math.round(effectiveChaptersPerDay * 4);

  const handleSave = () => {
    const updatedGoal: ReadingPlanGoal = {
      type: goalType,
      targetChapters,
      readingDaysPerWeek,
      startDate,
      reminderTime,
      customNotes: customNotes.trim()
    };

    if (onSelectPlan && selectedPlanId !== activePlan.id) {
      onSelectPlan(selectedPlanId);
    }

    onSaveGoal(selectedPlanId, updatedGoal);
    soundSynthesizer.playChime();
    onClose();
  };

  const handleResetToDefault = () => {
    const def = currentSelectedPlan.defaultGoal;
    setGoalType(def.type);
    setTargetChapters(def.targetChapters);
    setReadingDaysPerWeek(def.readingDaysPerWeek);
    setStartDate(def.startDate);
    setReminderTime(def.reminderTime || '07:00');
    setCustomNotes(def.customNotes || '');
  };

  return (
    <div
      id="modal-reading-goal-customizer-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        id="modal-reading-goal-customizer-card"
        className="bg-[#FAF8F5] rounded-3xl max-w-xl w-full border border-[#E8E1D5] shadow-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto space-y-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF0DE] text-[#8C6D3F] border border-[#EADBCC]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-devotional text-xl sm:text-2xl font-bold text-[#2B2319]">
                Personalizar Plano & Metas
              </h3>
              <p className="text-xs text-[#7A6F5F]">
                Defina seu ritmo de leitura diária ou semanal da Bíblia
              </p>
            </div>
          </div>
          <button
            id="btn-close-reading-goal-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7165] hover:text-[#2B2620] hover:bg-[#EFE9DF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Switcher / Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#735A34]">
            1. Plano de Leitura Selecionado
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {READING_PLANS_DATA.map((plan) => {
              const isSel = plan.id === selectedPlanId;
              return (
                <button
                  key={plan.id}
                  id={`btn-select-plan-${plan.id}`}
                  type="button"
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    setTargetChapters(plan.defaultGoal.targetChapters);
                    setReadingDaysPerWeek(plan.defaultGoal.readingDaysPerWeek);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                    isSel
                      ? 'bg-[#F4EFE6] border-[#8C6D3F] ring-2 ring-[#8C6D3F]/20'
                      : 'bg-white border-[#E8E1D5] hover:bg-[#FAF6ED]'
                  }`}
                >
                  <BookOpen className={`w-4 h-4 mt-0.5 shrink-0 ${isSel ? 'text-[#8C6D3F]' : 'text-[#A09382]'}`} />
                  <div>
                    <h4 className="text-xs font-bold text-[#2E281F]">
                      {plan.title}
                    </h4>
                    <p className="text-[11px] text-[#7A7165]">
                      {plan.totalDays} dias • {plan.totalChapters} capítulos
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Goal Type Selector: Daily vs Weekly */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#735A34]">
            2. Tipo de Meta de Leitura
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="btn-goal-type-daily"
              type="button"
              onClick={() => {
                setGoalType('daily');
                if (targetChapters > 10) setTargetChapters(3);
              }}
              className={`py-2.5 px-4 rounded-xl font-semibold text-xs transition-all border flex items-center justify-center gap-2 ${
                goalType === 'daily'
                  ? 'bg-[#8C6D3F] text-white border-[#8C6D3F] shadow-2xs'
                  : 'bg-white text-[#5E5140] border-[#D9CABE] hover:bg-[#FAF6ED]'
              }`}
            >
              <span>Meta Diária</span>
              {goalType === 'daily' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              id="btn-goal-type-weekly"
              type="button"
              onClick={() => {
                setGoalType('weekly');
                if (targetChapters < 10) setTargetChapters(18);
              }}
              className={`py-2.5 px-4 rounded-xl font-semibold text-xs transition-all border flex items-center justify-center gap-2 ${
                goalType === 'weekly'
                  ? 'bg-[#8C6D3F] text-white border-[#8C6D3F] shadow-2xs'
                  : 'bg-white text-[#5E5140] border-[#D9CABE] hover:bg-[#FAF6ED]'
              }`}
            >
              <span>Meta Semanal</span>
              {goalType === 'weekly' && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Target Quantity Presets & Input */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#735A34]">
              3. Quantidade de Capítulos ({goalType === 'daily' ? 'por Dia' : 'por Semana'})
            </label>
            <span className="text-xs font-bold text-[#8C6D3F] bg-[#FAF0DE] px-2.5 py-0.5 rounded-full border border-[#EADBCC]">
              {targetChapters} {targetChapters === 1 ? 'capítulo' : 'capítulos'} / {goalType === 'daily' ? 'dia' : 'sem.'}
            </span>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2">
            {goalType === 'daily' ? (
              <>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    id={`btn-preset-ch-${num}`}
                    type="button"
                    onClick={() => setTargetChapters(num)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      targetChapters === num
                        ? 'bg-[#8C6D3F] text-white border-[#8C6D3F]'
                        : 'bg-white text-[#544736] border-[#D9CABE] hover:bg-[#FAF6ED]'
                    }`}
                  >
                    {num} {num === 1 ? 'cap.' : 'caps.'}
                  </button>
                ))}
              </>
            ) : (
              <>
                {[10, 15, 18, 20, 25, 30].map((num) => (
                  <button
                    key={num}
                    id={`btn-preset-ch-${num}`}
                    type="button"
                    onClick={() => setTargetChapters(num)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      targetChapters === num
                        ? 'bg-[#8C6D3F] text-white border-[#8C6D3F]'
                        : 'bg-white text-[#544736] border-[#D9CABE] hover:bg-[#FAF6ED]'
                    }`}
                  >
                    {num} caps./sem
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Range Slider for granular control */}
          <div className="pt-1">
            <input
              type="range"
              min={goalType === 'daily' ? 1 : 5}
              max={goalType === 'daily' ? 10 : 50}
              step={1}
              value={targetChapters}
              onChange={(e) => setTargetChapters(Number(e.target.value))}
              className="w-full accent-[#8C6D3F] cursor-pointer"
            />
          </div>
        </div>

        {/* Reading Days Per Week */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#735A34]">
            4. Dias de Leitura por Semana
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { days: 5, label: '5 dias / semana', note: 'Seg a Sex (Fins de semana livres)' },
              { days: 6, label: '6 dias / semana', note: 'Seg a Sáb (Domingo reflexão)' },
              { days: 7, label: '7 dias / semana', note: 'Todos os dias sem pausa' }
            ].map((opt) => (
              <button
                key={opt.days}
                id={`btn-reading-days-${opt.days}`}
                type="button"
                onClick={() => setReadingDaysPerWeek(opt.days)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  readingDaysPerWeek === opt.days
                    ? 'bg-[#8C6D3F] text-white border-[#8C6D3F] shadow-2xs'
                    : 'bg-white text-[#4A3D2E] border-[#D9CABE] hover:bg-[#FAF6ED]'
                }`}
              >
                <div className="font-bold text-xs">{opt.label}</div>
                <div className={`text-[10px] mt-0.5 ${readingDaysPerWeek === opt.days ? 'text-[#F5EFE6]' : 'text-[#8E8070]'}`}>
                  {opt.days === 7 ? 'Diário' : `${7 - opt.days}d descanso`}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Date & Daily Reminder Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5B4C3A] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8C6D3F]" />
              <span>Data de Início</span>
            </label>
            <input
              id="input-plan-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-[#D9CABE] text-xs font-semibold text-[#3D3325] focus:outline-none focus:ring-2 focus:ring-[#8C6D3F]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5B4C3A] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8C6D3F]" />
              <span>Horário de Leitura Habitual</span>
            </label>
            <input
              id="input-plan-reminder-time"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-[#D9CABE] text-xs font-semibold text-[#3D3325] focus:outline-none focus:ring-2 focus:ring-[#8C6D3F]"
            />
          </div>
        </div>

        {/* Personal Devotional Intention / Notes */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#5B4C3A]">
            Propósito / Motivação Pessoal (Opcional)
          </label>
          <input
            id="input-plan-custom-notes"
            type="text"
            placeholder="Ex: Ler a Bíblia pela manhã antes do trabalho para ter paz interior..."
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-[#D9CABE] text-xs text-[#3D3325] focus:outline-none focus:ring-2 focus:ring-[#8C6D3F]"
          />
        </div>

        {/* Real-time Pace Forecast Box */}
        <div
          id="box-plan-pace-forecast"
          className="p-4 rounded-2xl bg-gradient-to-br from-[#F6EFE4] to-[#ECE1CF] border border-[#E0D0BB] space-y-2 text-xs"
        >
          <div className="flex items-center gap-2 text-[#735A34] font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Previsão Dinâmica de Conclusão</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[#4D3F2E] pt-1">
            <div className="bg-white/70 p-2.5 rounded-xl border border-[#E8DCCB]">
              <span className="text-[10px] uppercase font-bold text-[#8C6D3F] block">Ritmo Diário</span>
              <span className="font-bold text-sm">~{effectiveChaptersPerDay} caps/dia</span>
            </div>
            <div className="bg-white/70 p-2.5 rounded-xl border border-[#E8DCCB]">
              <span className="text-[10px] uppercase font-bold text-[#8C6D3F] block">Tempo Estimado</span>
              <span className="font-bold text-sm">~{estimatedMinutesPerDay} min/dia</span>
            </div>
            <div className="bg-white/70 p-2.5 rounded-xl border border-[#E8DCCB] col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-[#8C6D3F] block">Conclusão Prevista</span>
              <span className="font-bold text-xs line-clamp-1">{formattedEndDate}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E8E1D5] gap-2">
          <button
            id="btn-reset-plan-goal"
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2.5 rounded-xl border border-[#D9CABE] text-xs font-semibold text-[#6E604F] hover:bg-[#EFE9DF] transition-colors flex items-center gap-1.5"
            title="Restaurar padrão sugerido para este plano"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Padrão</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="btn-cancel-reading-goal"
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#D9CABE] text-xs font-semibold text-[#6E604F] hover:bg-[#EFE9DF] transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btn-confirm-reading-goal"
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#8C6D3F] hover:bg-[#785C32] text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Salvar e Ativar Meta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
