import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Bell,
  BellRing,
  AlertCircle,
  CheckCircle2,
  X,
  ExternalLink,
  Download,
  CalendarCheck,
  Sparkles,
  Repeat,
  Volume2,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { PrayerEntry, PrayerReminder } from '../types';
import {
  checkBrowserNotificationSupport,
  requestBrowserNotificationPermission,
  generateGoogleCalendarUrl,
  downloadIcsCalendarFile,
  triggerPrayerBrowserNotification
} from '../utils/calendarReminder';

interface PrayerReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayer: PrayerEntry | null;
  onSaveReminder: (prayerId: string, reminder: PrayerReminder) => void;
  onRemoveReminder: (prayerId: string) => void;
}

const QUICK_TIMES = [
  { label: '06:00', hint: 'Manhã Cedo' },
  { label: '07:00', hint: 'Devocional' },
  { label: '12:00', hint: 'Meio-Dia' },
  { label: '15:00', hint: 'Hora Nona' },
  { label: '18:00', hint: 'Entardecer' },
  { label: '21:00', hint: 'Noite' },
];

export const PrayerReminderModal: React.FC<PrayerReminderModalProps> = ({
  isOpen,
  onClose,
  prayer,
  onSaveReminder,
  onRemoveReminder,
}) => {
  if (!isOpen || !prayer) return null;

  const existingReminder = prayer.reminder;
  const todayIso = new Date().toISOString().split('T')[0];

  const [scheduledTime, setScheduledTime] = useState<string>(
    existingReminder?.scheduledTime || '07:00'
  );
  const [scheduledDate, setScheduledDate] = useState<string>(
    existingReminder?.scheduledDate || todayIso
  );
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekdays'>(
    existingReminder?.frequency || 'daily'
  );
  const [notes, setNotes] = useState<string>(
    existingReminder?.notes || ''
  );
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const { permission } = checkBrowserNotificationSupport();
    setPermissionStatus(permission);
  }, [isOpen]);

  const handleRequestPermission = async () => {
    setIsRequestingPermission(true);
    try {
      const result = await requestBrowserNotificationPermission();
      setPermissionStatus(result);
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const currentReminderDraft: PrayerReminder = {
    id: existingReminder?.id || 'reminder-' + Date.now(),
    prayerId: prayer.id,
    scheduledTime,
    scheduledDate,
    frequency,
    enabled: true,
    notes: notes.trim() || undefined,
    createdAt: existingReminder?.createdAt || new Date().toISOString(),
    lastNotifiedDate: existingReminder?.lastNotifiedDate,
  };

  const handleSave = async () => {
    // If browser permission is still 'default', proactively request it
    if (permissionStatus === 'default') {
      try {
        const res = await requestBrowserNotificationPermission();
        setPermissionStatus(res);
      } catch {
        // continue saving reminder in app
      }
    }

    onSaveReminder(prayer.id, currentReminderDraft);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleTestNotification = () => {
    triggerPrayerBrowserNotification(prayer, notes);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3500);
  };

  const handleOpenGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(prayer, currentReminderDraft);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadIcs = () => {
    downloadIcsCalendarFile(prayer, currentReminderDraft);
  };

  const handleDeleteReminder = () => {
    onRemoveReminder(prayer.id);
    onClose();
  };

  return (
    <div
      id="prayer-reminder-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="prayer-reminder-modal-content"
        className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl shadow-2xl border border-[#D9CABE] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-b from-[#F4EFE6] to-[#FAF8F5] border-b border-[#E3D7C7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E8DCCB] text-[#7A5B2B] flex items-center justify-center shadow-2xs">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-devotional text-xl font-bold text-[#2C241B]">
                Lembrete de Oração & Calendário
              </h2>
              <p className="text-xs text-[#7A6B59]">
                Agende momentos para clamar com perseverança por este pedido
              </p>
            </div>
          </div>
          <button
            id="btn-close-prayer-reminder-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C7D6B] hover:text-[#2C241B] hover:bg-[#EBE2D3] transition-colors"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#2C241B]">
          {/* Target Prayer Summary Card */}
          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E5DACD] shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C6D3F] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pedido Selecionado:</span>
            </div>
            <h3 className="font-serif-devotional font-bold text-[#35291E] text-base leading-snug">
              {prayer.title}
            </h3>
            <p className="text-xs text-[#6B5E4F] line-clamp-2 mt-1">
              {prayer.description}
            </p>
          </div>

          {/* Browser Notification Permission Card */}
          <div className="p-4 rounded-2xl border transition-all duration-200">
            {permissionStatus === 'granted' ? (
              <div className="flex items-start gap-3 bg-[#EEF7F1] border border-[#BDE3CA] p-3.5 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-[#1E733B] shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <div className="font-bold text-[#15572B] flex items-center gap-1.5">
                    <span>Permissão de Notificação Concedida</span>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[#25663B] mt-0.5 leading-relaxed">
                    Seu navegador enviará um toque suave e aviso no horário definido quando o app estiver em uso.
                  </p>
                  <button
                    id="btn-test-notification-modal"
                    onClick={handleTestNotification}
                    className="mt-2 text-xs font-semibold text-[#186333] hover:underline flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{testSent ? '✓ Notificação de teste enviada!' : 'Testar som e notificação agora'}</span>
                  </button>
                </div>
              </div>
            ) : permissionStatus === 'denied' ? (
              <div className="flex items-start gap-3 bg-[#FFF3F3] border border-[#F5CACA] p-3.5 rounded-xl">
                <AlertCircle className="w-5 h-5 text-[#B92B27] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-[#8C1E1B]">Notificações Bloqueadas no Navegador</div>
                  <p className="text-[#A33532] mt-0.5 leading-relaxed">
                    As permissões foram negadas pelo navegador. Você ainda pode usar o botão abaixo para
                    <strong> sincronizar direto com seu Google Calendar</strong> ou baixar o arquivo <strong>.ics</strong> com alarme.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FBF5EC] border border-[#E9D7BF] p-3.5 rounded-xl">
                <div className="flex items-start gap-2.5">
                  <Bell className="w-5 h-5 text-[#A1712A] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-bold text-[#6D4918]">Ativar Notificações no Dispositivo</div>
                    <p className="text-[#7A5B2B] mt-0.5 leading-relaxed">
                      Solicite autorização para que o app lembre você de orar no horário agendado.
                    </p>
                  </div>
                </div>
                <button
                  id="btn-request-notification-permission-modal"
                  onClick={handleRequestPermission}
                  disabled={isRequestingPermission}
                  className="px-3.5 py-1.5 rounded-xl bg-[#8C6D3F] hover:bg-[#735832] text-white text-xs font-bold shrink-0 transition-colors shadow-2xs active:scale-95"
                >
                  {isRequestingPermission ? 'Solicitando...' : 'Permitir Avisos'}
                </button>
              </div>
            )}
          </div>

          {/* Time & Schedule Settings */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A6B59] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8C6D3F]" />
              <span>Configurações do Horário</span>
            </h4>

            {/* Quick Time Buttons */}
            <div>
              <label className="block text-xs font-medium text-[#6B5E4F] mb-1.5">
                Atalhos de Horários Devocionais:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {QUICK_TIMES.map((qt) => {
                  const isSelected = scheduledTime === qt.label;
                  return (
                    <button
                      key={qt.label}
                      type="button"
                      id={`btn-quick-time-${qt.label.replace(':', '')}`}
                      onClick={() => setScheduledTime(qt.label)}
                      className={`p-2 rounded-xl text-center border transition-all text-xs font-semibold ${
                        isSelected
                          ? 'bg-[#8C6D3F] text-white border-[#8C6D3F] shadow-2xs'
                          : 'bg-[#FFFDF9] border-[#D8CABA] text-[#594B3C] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      <div>{qt.label}</div>
                      <div className={`text-[10px] font-normal ${isSelected ? 'text-[#F3EADE]' : 'text-[#8E7E6E]'}`}>
                        {qt.hint}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Input & Date Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A3F33] mb-1">
                  Horário Específico:
                </label>
                <div className="relative">
                  <input
                    id="input-prayer-reminder-time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CABE] bg-[#FFFDF9] text-[#2C241B] font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-[#8C6D3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3F33] mb-1">
                  Data de Início:
                </label>
                <input
                  id="input-prayer-reminder-date"
                  type="date"
                  value={scheduledDate}
                  min={todayIso}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CABE] bg-[#FFFDF9] text-[#2C241B] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#8C6D3F]"
                />
              </div>
            </div>

            {/* Frequency Options */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3F33] mb-1.5 flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-[#8C6D3F]" />
                <span>Repetição do Lembrete:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'once', label: 'Uma Vez', desc: 'No dia marcado' },
                  { id: 'daily', label: 'Diário', desc: 'Todos os dias' },
                  { id: 'weekdays', label: 'Seg a Sex', desc: 'Dias úteis' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    id={`btn-frequency-${opt.id}`}
                    onClick={() => setFrequency(opt.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      frequency === opt.id
                        ? 'bg-[#FAF3E8] border-[#A88856] ring-1 ring-[#A88856]'
                        : 'bg-[#FFFDF9] border-[#D9CABE] hover:bg-[#F3EDE2]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#352A1E]">{opt.label}</div>
                    <div className="text-[11px] text-[#7A6C5B]">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes / Special Focus */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3F33] mb-1">
                Foco ou Intenção da Oração (Opcional):
              </label>
              <input
                id="input-prayer-reminder-notes"
                type="text"
                placeholder="Ex: Interceder por força na consulta médica, paz na família..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9CABE] bg-[#FFFDF9] text-xs text-[#2C241B] focus:outline-hidden focus:ring-2 focus:ring-[#8C6D3F]"
              />
            </div>
          </div>

          {/* Direct Calendar Export Actions */}
          <div className="pt-4 border-t border-[#EAE0D2] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A6B59] flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5 text-[#8C6D3F]" />
              <span>Sincronizar com Aplicativos de Calendário</span>
            </h4>
            <p className="text-xs text-[#6B5F52]">
              Além dos avisos no app, adicione este compromisso à sua agenda pessoal com alarmes automáticos:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Google Calendar */}
              <button
                type="button"
                id="btn-add-to-google-calendar"
                onClick={handleOpenGoogleCalendar}
                className="px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] hover:bg-[#F4ECE0] border border-[#D9CABE] text-[#3D3224] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <ExternalLink className="w-4 h-4 text-[#1A73E8]" />
                <span>Google Calendar</span>
              </button>

              {/* ICS Calendar File */}
              <button
                type="button"
                id="btn-download-ics-calendar"
                onClick={handleDownloadIcs}
                className="px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] hover:bg-[#F4ECE0] border border-[#D9CABE] text-[#3D3224] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                title="Compatível com Apple Calendar, Outlook e celulares"
              >
                <Download className="w-4 h-4 text-[#8C6D3F]" />
                <span>Baixar (.ics) Apple/Outlook</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F5EFE4] border-t border-[#E0D4C3] flex flex-wrap items-center justify-between gap-3">
          <div>
            {existingReminder && (
              <button
                type="button"
                id="btn-delete-prayer-reminder"
                onClick={handleDeleteReminder}
                className="text-xs font-semibold text-[#A83232] hover:text-[#7A1E1E] flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-[#FCEAEA] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Lembrete</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-cancel-prayer-reminder"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#665847] hover:bg-[#EAE1D3] transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              id="btn-save-prayer-reminder"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-[#8C6D3F] hover:bg-[#735832] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#A8F0C6]" />
                  <span>Lembrete Salvo!</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Salvar Lembrete Agendado</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
