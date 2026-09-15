import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Sparkles,
  Send,
  Trash2,
  Check,
  Calendar,
  Heart
} from 'lucide-react';
import { NotificationSchedule, InAppNotification, PrayerEntry } from '../types';
import { soundSynthesizer } from '../utils/audioEngine';

interface NotificationsViewProps {
  schedule: NotificationSchedule;
  onUpdateSchedule: (schedule: NotificationSchedule) => void;
  notifications: InAppNotification[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onAddNotification: (item: InAppNotification) => void;
  prayers?: PrayerEntry[];
  onNavigateToJournal?: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  schedule,
  onUpdateSchedule,
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
  onAddNotification,
  prayers = [],
  onNavigateToJournal,
}) => {
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  );
  const [testSentMessage, setTestSentMessage] = useState(false);

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setBrowserPermission(perm);
        if (perm === 'granted') {
          soundSynthesizer.playChime();
          new Notification('Notificações Ativadas! 🕊️', {
            body: 'Você receberá os devocionais diários e versículos nos horários definidos.',
            icon: '/favicon.ico',
          });
        }
      } catch {
        // Permission rejected or iframe restriction
      }
    }
  };

  const handleTriggerTestNotification = () => {
    soundSynthesizer.playChime();

    const testItem: InAppNotification = {
      id: 'notif-' + Date.now(),
      timestamp: new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date()),
      title: 'Momento de Paz: Filipenses 4:6-7',
      body: 'Não andeis ansiosos de coisa alguma; a paz de Deus que excede todo entendimento guardará o seu coração hoje.',
      type: 'morning',
      read: false,
    };

    onAddNotification(testItem);

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(testItem.title, {
          body: testItem.body,
          icon: '/favicon.ico',
        });
      } catch {
        // handled
      }
    }

    setTestSentMessage(true);
    setTimeout(() => setTestSentMessage(false), 3000);
  };

  const updateMorning = (enabled: boolean, time?: string) => {
    onUpdateSchedule({
      ...schedule,
      morning: {
        ...schedule.morning,
        enabled,
        time: time !== undefined ? time : schedule.morning.time,
      },
    });
  };

  const updateNoon = (enabled: boolean, time?: string) => {
    onUpdateSchedule({
      ...schedule,
      noon: {
        ...schedule.noon,
        enabled,
        time: time !== undefined ? time : schedule.noon.time,
      },
    });
  };

  const updateEvening = (enabled: boolean, time?: string) => {
    onUpdateSchedule({
      ...schedule,
      evening: {
        ...schedule.evening,
        enabled,
        time: time !== undefined ? time : schedule.evening.time,
      },
    });
  };

  return (
    <div id="notifications-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Intro Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D3F]">
          Lembretes & Alertas Espirituais
        </span>
        <h2 className="font-serif-devotional text-2xl sm:text-3xl font-bold text-[#2B2319]">
          Central de Notificações
        </h2>
        <p className="text-sm text-[#6E6354]">
          Programe horários regulares ao longo do dia para pausar, orar e ler as Escrituras.
        </p>
      </div>

      {/* Browser Permission Banner */}
      <div
        id="browser-permission-card"
        className="p-5 sm:p-6 rounded-3xl bg-[#F6F0E6] border border-[#E8DCC9] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#8C6D3F] text-white shrink-0 mt-0.5 sm:mt-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-devotional font-bold text-base text-[#2E2419]">
                Notificações no Dispositivo
              </h3>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  browserPermission === 'granted'
                    ? 'bg-[#D7EBDC] text-[#22502E]'
                    : browserPermission === 'denied'
                    ? 'bg-[#FBE4E2] text-[#8C2B24]'
                    : 'bg-[#EAE2D5] text-[#695C4A]'
                }`}
              >
                {browserPermission === 'granted'
                  ? 'Permissão Ativa ✓'
                  : browserPermission === 'denied'
                  ? 'Bloqueado no Navegador'
                  : 'Pendente'}
              </span>
            </div>
            <p className="text-xs text-[#7A6F5F] mt-0.5">
              Receba alertas no sistema mesmo com a aba em segundo plano.
            </p>
          </div>
        </div>

        {browserPermission !== 'granted' ? (
          <button
            id="btn-request-notification-permission"
            onClick={requestBrowserPermission}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#8C6D3F] hover:bg-[#785C32] text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
          >
            Ativar Notificações
          </button>
        ) : (
          <span className="text-xs font-semibold text-[#2D6A3E] flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            Configurado
          </span>
        )}
      </div>

      {/* Schedule Configuration Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-devotional text-xl font-bold text-[#2B2319]">
            Horários de Oração Diária
          </h3>
          <button
            id="btn-test-notification"
            onClick={handleTriggerTestNotification}
            className="px-3.5 py-1.5 rounded-xl border border-[#D8CABE] bg-[#FFFDFB] hover:bg-[#FAF4EB] text-xs font-semibold text-[#735A33] flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Testar Notificação Agora</span>
          </button>
        </div>

        {testSentMessage && (
          <div
            id="test-notification-alert"
            className="p-3 rounded-xl bg-[#E0EFE3] text-[#1A5C28] text-xs font-medium border border-[#BBDCBF] flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Notificação de teste disparada com som sacro de sino!</span>
          </div>
        )}

        <div className="space-y-3">
          {/* Morning Devotional */}
          <div
            id="card-morning-reminder"
            className="p-4 sm:p-5 rounded-2xl bg-[#FFFDFB] border border-[#E8E1D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#FFF5E6] text-[#C27803]">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-devotional font-bold text-base text-[#2E281F]">
                  Devocional da Manhã
                </h4>
                <p className="text-xs text-[#7A7165]">
                  Comece o dia renovando os pensamentos e consagrando as primeiras horas ao Senhor
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <input
                id="input-morning-time"
                type="time"
                value={schedule.morning.time}
                onChange={(e) => updateMorning(schedule.morning.enabled, e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#D9CEBF] bg-[#FAF8F5] text-xs font-semibold text-[#3D3428] focus:outline-none focus:ring-1 focus:ring-[#8C6D3F]"
              />
              <button
                id="toggle-morning-enabled"
                onClick={() => updateMorning(!schedule.morning.enabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  schedule.morning.enabled ? 'bg-[#8C6D3F]' : 'bg-[#DDD5C7]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    schedule.morning.enabled ? 'translate-x-6.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Noon Verse */}
          <div
            id="card-noon-reminder"
            className="p-4 sm:p-5 rounded-2xl bg-[#FFFDFB] border border-[#E8E1D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#FFF8E6] text-[#A66E14]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-devotional font-bold text-base text-[#2E281F]">
                  Pausa do Meio-Dia (Versículo Chave)
                </h4>
                <p className="text-xs text-[#7A7165]">
                  Um lembrete rápido para desacelerar o ritmo de trabalho e respirar a Palavra
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <input
                id="input-noon-time"
                type="time"
                value={schedule.noon.time}
                onChange={(e) => updateNoon(schedule.noon.enabled, e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#D9CEBF] bg-[#FAF8F5] text-xs font-semibold text-[#3D3428] focus:outline-none focus:ring-1 focus:ring-[#8C6D3F]"
              />
              <button
                id="toggle-noon-enabled"
                onClick={() => updateNoon(!schedule.noon.enabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  schedule.noon.enabled ? 'bg-[#8C6D3F]' : 'bg-[#DDD5C7]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    schedule.noon.enabled ? 'translate-x-6.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Evening Prayer */}
          <div
            id="card-evening-reminder"
            className="p-4 sm:p-5 rounded-2xl bg-[#FFFDFB] border border-[#E8E1D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#EEF2F7] text-[#344860]">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-devotional font-bold text-base text-[#2E281F]">
                  Oração da Noite & Gratidão
                </h4>
                <p className="text-xs text-[#7A7165]">
                  Entregue as preocupações do dia e descanse sob o abrigo e a paz de Deus
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <input
                id="input-evening-time"
                type="time"
                value={schedule.evening.time}
                onChange={(e) => updateEvening(schedule.evening.enabled, e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#D9CEBF] bg-[#FAF8F5] text-xs font-semibold text-[#3D3428] focus:outline-none focus:ring-1 focus:ring-[#8C6D3F]"
              />
              <button
                id="toggle-evening-enabled"
                onClick={() => updateEvening(!schedule.evening.enabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  schedule.evening.enabled ? 'bg-[#8C6D3F]' : 'bg-[#DDD5C7]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    schedule.evening.enabled ? 'translate-x-6.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Prayer Reminders Section */}
      {(() => {
        const activePrayerReminders = prayers.filter((p) => p.reminder && p.reminder.enabled);
        if (activePrayerReminders.length === 0) return null;

        return (
          <div id="prayer-reminders-section" className="space-y-4 pt-4 border-t border-[#E8E1D5]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FAF3E8] text-[#8C6D3F] border border-[#E9D9C3]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-devotional text-lg sm:text-xl font-bold text-[#2B2319]">
                    Lembretes de Oração Agendados
                  </h3>
                  <p className="text-xs text-[#7A6F5F]">
                    Pedidos com horários e alarmes definidos para orar
                  </p>
                </div>
              </div>

              {onNavigateToJournal && (
                <button
                  id="btn-nav-journal-from-notifs"
                  onClick={onNavigateToJournal}
                  className="text-xs font-semibold text-[#8C6D3F] hover:underline"
                >
                  Abrir Diário
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activePrayerReminders.map((p) => {
                const rem = p.reminder!;
                return (
                  <div
                    key={p.id}
                    id={`prayer-reminder-card-${p.id}`}
                    className="p-4 rounded-2xl bg-[#FFFDFB] border border-[#EADBCC] shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-[#35291E] line-clamp-1">
                        {p.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0DE] text-[#7A551E] shrink-0">
                        {rem.scheduledTime}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B5E4E] line-clamp-2">
                      {rem.notes || p.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#8C7D6B] pt-2 border-t border-[#F2ECE1]">
                      <span>
                        {rem.frequency === 'daily'
                          ? 'Diariamente'
                          : rem.frequency === 'weekdays'
                          ? 'Dias Úteis'
                          : `Data: ${rem.scheduledDate}`}
                      </span>
                      {onNavigateToJournal && (
                        <button
                          onClick={onNavigateToJournal}
                          className="text-[#8C6D3F] font-semibold hover:underline"
                        >
                          Ver no Diário →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* In-App Notifications Inbox / History */}
      <div className="space-y-4 pt-4 border-t border-[#E8E1D5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-serif-devotional text-xl font-bold text-[#2B2319]">
              Histórico de Mensagens Recebidas
            </h3>
            <span className="text-xs text-[#8C8070]">
              ({notifications.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <>
                <button
                  id="btn-mark-all-read"
                  onClick={onMarkAllAsRead}
                  className="text-xs text-[#8C6D3F] hover:underline font-semibold"
                >
                  Marcar como lidas
                </button>
                <button
                  id="btn-clear-notifications"
                  onClick={onClearNotifications}
                  className="p-1 rounded text-[#9E9383] hover:text-[#942C24] transition-colors"
                  title="Limpar histórico"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                id={`notification-item-${item.id}`}
                className={`p-4 rounded-2xl border transition-all ${
                  item.read
                    ? 'bg-[#FAF8F5] border-[#E8E1D5]'
                    : 'bg-[#FFFDF9] border-[#E3D3BE] shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif-devotional font-semibold text-sm text-[#2E281F]">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-[#9E9587]">{item.timestamp}</span>
                </div>
                <p className="text-xs text-[#6B5E4E] leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-[#F8F4ED] rounded-2xl border border-[#EADBCC] text-xs text-[#7A7165]">
              Nenhuma notificação recente. Clique em "Testar Notificação Agora" para experimentar!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
