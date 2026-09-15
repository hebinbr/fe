import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DevotionalView } from './components/DevotionalView';
import { VersesView } from './components/VersesView';
import { PrayerJournalView } from './components/PrayerJournalView';
import { AudioMeditationView } from './components/AudioMeditationView';
import { ReadingPlanView } from './components/ReadingPlanView';
import { NotificationsView } from './components/NotificationsView';
import { GlobalAudioBar } from './components/GlobalAudioBar';
import {
  UserPreferences,
  AppTab,
  NotificationSchedule,
  InAppNotification,
  PrayerEntry,
} from './types';
import { INITIAL_PRAYERS } from './data/prayersData';
import { soundSynthesizer, devotionalTTS, TTSState } from './utils/audioEngine';

const STORAGE_PREFS_KEY = 'devocional_app_preferences_v1';
const STORAGE_NOTIF_KEY = 'devocional_app_notifications_v1';
const STORAGE_SCHEDULE_KEY = 'devocional_app_schedule_v1';
const STORAGE_PRAYERS_KEY = 'devocional_app_prayers_v1';

const DEFAULT_PREFERENCES: UserPreferences = {
  completedDevotionals: [],
  bookmarkedDevotionals: [],
  favoriteVerses: ['v-01', 'v-02'],
  planProgress: {
    'plan-evangelhos': [1],
    'plan-salmos-proverbios': [1],
  },
  activePlanId: 'plan-evangelhos',
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  fontSize: 'normal',
  journalNotes: {},
  themeMode: 'parchment',
};

const DEFAULT_SCHEDULE: NotificationSchedule = {
  morning: {
    enabled: true,
    time: '07:00',
    title: 'Devocional da Manhã',
    body: 'Renove seus pensamentos com a Palavra antes de iniciar o dia.',
  },
  noon: {
    enabled: true,
    time: '12:30',
    title: 'Pausa do Meio-Dia',
    body: 'Uma pausa de 3 minutos para respirar o amor e a paz de Cristo.',
  },
  evening: {
    enabled: true,
    time: '21:00',
    title: 'Oração da Noite',
    body: 'Agradeça pelas bênçãos do dia e descanse sob a guarda do Bom Pastor.',
  },
};

const DEFAULT_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'welcome-01',
    timestamp: 'Hoje, 07:00',
    title: 'Bem-vindo ao seu Devocional Diário 🕊️',
    body: 'Que a graça e a paz do Senhor acompanhem você nesta jornada diária de fé.',
    type: 'morning',
    read: false,
  },
  {
    id: 'welcome-02',
    timestamp: 'Hoje, 12:30',
    title: 'Promessa do Dia: Salmo 23',
    body: 'O Senhor é o meu pastor; nada me faltará. Ele refrigera a minha alma.',
    type: 'noon',
    read: false,
  },
];

export default function App() {
  // Load preferences from local storage
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFS_KEY);
      if (saved) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
      }
    } catch {
      // LocalStorage unavailable
    }
    return DEFAULT_PREFERENCES;
  });

  // Schedule state
  const [schedule, setSchedule] = useState<NotificationSchedule>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SCHEDULE_KEY);
      if (saved) {
        return { ...DEFAULT_SCHEDULE, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SCHEDULE;
  });

  // In-app notifications
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTIF_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_NOTIFICATIONS;
  });

  // Prayer Journal state
  const [prayers, setPrayers] = useState<PrayerEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PRAYERS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_PRAYERS;
  });

  const [activeTab, setActiveTab] = useState<AppTab>('devocional');

  // Audio Engine State
  const [ttsState, setTtsState] = useState<TTSState>(devotionalTTS.getState());
  const [currentAmbient, setCurrentAmbient] = useState<string | null>(null);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);
  const [ambientVolume, setAmbientVolume] = useState<number>(0.45);

  // Sync Preferences to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(preferences));
    } catch {
      // Ignored
    }
  }, [preferences]);

  // Sync Schedule to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SCHEDULE_KEY, JSON.stringify(schedule));
    } catch {
      // Ignored
    }
  }, [schedule]);

  // Sync Notifications to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify(notifications));
    } catch {
      // Ignored
    }
  }, [notifications]);

  // Sync Prayers to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PRAYERS_KEY, JSON.stringify(prayers));
    } catch {
      // Ignored
    }
  }, [prayers]);

  // Subscribe to TTS changes
  useEffect(() => {
    const unsubscribe = devotionalTTS.subscribe((state) => {
      setTtsState({ ...state });
    });
    return () => unsubscribe();
  }, []);

  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  // Prayer Journal Handlers
  const handleAddPrayer = (newPrayer: Omit<PrayerEntry, 'id' | 'timesPrayed'>) => {
    const nowTimeStr = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    const item: PrayerEntry = {
      ...newPrayer,
      id: 'prayer-' + Date.now(),
      timesPrayed: 1,
      lastPrayedAt: `Hoje às ${nowTimeStr}`,
    };
    setPrayers((prev) => [item, ...prev]);
  };

  const handleUpdatePrayer = (id: string, updated: Partial<PrayerEntry>) => {
    setPrayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const handleDeletePrayer = (id: string) => {
    setPrayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleIncrementPrayedCount = (id: string) => {
    const nowTimeStr = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    setPrayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              timesPrayed: (p.timesPrayed || 0) + 1,
              lastPrayedAt: `Hoje às ${nowTimeStr}`,
            }
          : p
      )
    );
  };

  const handleMarkPrayerAsAnswered = (id: string, testimony: string, answeredDate: string) => {
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'respondido',
              testimony,
              answeredDate,
            }
          : p
      )
    );
  };

  const handlePlayAmbient = (type: 'pad' | 'rain' | 'stream' | 'harp' | 'wind') => {
    soundSynthesizer.playAmbient(type);
    setCurrentAmbient(type);
    setIsAmbientPlaying(true);
  };

  const handleStopAmbient = () => {
    soundSynthesizer.stopAmbient();
    setCurrentAmbient(null);
    setIsAmbientPlaying(false);
  };

  const handleChangeAmbientVolume = (vol: number) => {
    setAmbientVolume(vol);
    soundSynthesizer.setAmbientVolume(vol);
  };

  const handleToggleAmbient = () => {
    if (isAmbientPlaying) {
      handleStopAmbient();
    } else {
      handlePlayAmbient('pad');
    }
  };

  // Notification handlers
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleAddNotification = (item: InAppNotification) => {
    setNotifications((prev) => [item, ...prev]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Theme container classes
  const themeBgClasses = {
    parchment: 'bg-[#FAF8F5] text-[#26221D]',
    warm: 'bg-[#FFFBF2] text-[#292015]',
    clean: 'bg-[#F9FAFB] text-[#1F2937]',
  }[preferences.themeMode];

  return (
    <div
      id="app-root"
      className={`min-h-screen flex flex-col transition-colors duration-300 ${themeBgClasses}`}
    >
      {/* Top Header */}
      <Header
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadNotificationsCount={unreadCount}
      />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadNotificationsCount={unreadCount}
      />

      {/* Main Content Area */}
      <main id="main-content-container" className="flex-1 pb-24">
        {activeTab === 'devocional' && (
          <DevotionalView
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            ttsState={ttsState}
            onStartMeditationSound={handlePlayAmbient}
            isAmbientPlaying={isAmbientPlaying}
            onToggleAmbient={handleToggleAmbient}
            onOpenPrayerJournal={() => setActiveTab('diario-oracao')}
          />
        )}

        {activeTab === 'versiculos' && (
          <VersesView
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            ttsState={ttsState}
          />
        )}

        {activeTab === 'diario-oracao' && (
          <PrayerJournalView
            prayers={prayers}
            onAddPrayer={handleAddPrayer}
            onUpdatePrayer={handleUpdatePrayer}
            onDeletePrayer={handleDeletePrayer}
            onIncrementPrayedCount={handleIncrementPrayedCount}
            onMarkAsAnswered={handleMarkPrayerAsAnswered}
            preferences={preferences}
            ttsState={ttsState}
          />
        )}

        {activeTab === 'audios' && (
          <AudioMeditationView
            preferences={preferences}
            ttsState={ttsState}
            currentAmbient={currentAmbient}
            isAmbientPlaying={isAmbientPlaying}
            onPlayAmbient={handlePlayAmbient}
            onStopAmbient={handleStopAmbient}
            ambientVolume={ambientVolume}
            onChangeAmbientVolume={handleChangeAmbientVolume}
          />
        )}

        {activeTab === 'plano' && (
          <ReadingPlanView
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            ttsState={ttsState}
          />
        )}

        {activeTab === 'notificacoes' && (
          <NotificationsView
            schedule={schedule}
            onUpdateSchedule={setSchedule}
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onClearNotifications={handleClearNotifications}
            onAddNotification={handleAddNotification}
          />
        )}
      </main>

      {/* Persistent Bottom Floating Audio Player Bar */}
      <GlobalAudioBar
        ttsState={ttsState}
        isAmbientPlaying={isAmbientPlaying}
        currentAmbient={currentAmbient}
        onStopAmbient={handleStopAmbient}
        ambientVolume={ambientVolume}
        onChangeAmbientVolume={handleChangeAmbientVolume}
      />

      {/* Elegant Footer */}
      <footer
        id="app-footer"
        className="border-t border-[#E8E1D5] bg-[#FAF8F5]/80 py-6 text-center text-xs text-[#7A7165]"
      >
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-serif-devotional italic text-sm text-[#4E4437]">
            "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho." — Salmo 119:105
          </p>
          <p className="text-[11px] text-[#9E9385]">
            Devocional Diário • Versículos • Diário de Oração • Áudios & Sons • Planos de Leitura • Notificações
          </p>
        </div>
      </footer>
    </div>
  );
}
