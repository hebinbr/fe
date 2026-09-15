export interface Devotional {
  id: string;
  title: string;
  subtitle: string;
  date: string; // YYYY-MM-DD
  theme: string; // ex: 'Paz Interior', 'Esperança', 'Fé & Oração'
  keyVerse: {
    reference: string;
    text: string;
  };
  reflection: string[];
  prayer: string;
  practicalAction: string;
  author: string;
  readTimeMinutes: number;
}

export interface BibleVerse {
  id: string;
  reference: string;
  text: string;
  version: string;
  theme: 'Paz' | 'Ansiedade' | 'Força' | 'Esperança' | 'Fé' | 'Gratidão' | 'Sabedoria' | 'Amor';
  highlightWord?: string;
  reflectionShort: string;
}

export interface ReadingPlanDay {
  day: number;
  title: string;
  passages: {
    reference: string;
    text: string;
  }[];
  devotionalInsight: string;
}

export interface ReadingPlan {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Evangelhos' | 'Sabedoria' | 'Novo Testamento' | 'Promessas';
  totalDays: number;
  estimatedMinutesPerDay: number;
  days: ReadingPlanDay[];
}

export interface AudioAmbientTrack {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'pad' | 'rain' | 'stream' | 'harp' | 'wind';
}

export interface NotificationSchedule {
  morning: {
    enabled: boolean;
    time: string;
    title: string;
    body: string;
  };
  noon: {
    enabled: boolean;
    time: string;
    title: string;
    body: string;
  };
  evening: {
    enabled: boolean;
    time: string;
    title: string;
    body: string;
  };
}

export interface InAppNotification {
  id: string;
  timestamp: string;
  title: string;
  body: string;
  type: 'morning' | 'noon' | 'evening' | 'system';
  read: boolean;
}

export type PrayerType = 'pedido' | 'agradecimento';
export type PrayerCategory = 'familia' | 'saude' | 'trabalho' | 'espiritual' | 'amigos' | 'pessoal' | 'outros';
export type PrayerStatus = 'ativo' | 'respondido' | 'descansando';

export interface PrayerReminder {
  id: string;
  prayerId: string;
  scheduledTime: string; // 'HH:mm'
  scheduledDate: string; // 'YYYY-MM-DD'
  frequency: 'once' | 'daily' | 'weekdays';
  enabled: boolean;
  notes?: string;
  createdAt: string;
  lastNotifiedDate?: string;
}

export interface PrayerEntry {
  id: string;
  type: PrayerType; // 'pedido' | 'agradecimento'
  title: string;
  description: string;
  category: PrayerCategory;
  date: string; // YYYY-MM-DD
  status: PrayerStatus;
  answeredDate?: string;
  testimony?: string; // Como Deus respondeu
  timesPrayed: number; // Quantidade de momentos de oração
  lastPrayedAt?: string;
  isFavorite?: boolean;
  reminder?: PrayerReminder;
}

export type AppTab = 'devocional' | 'versiculos' | 'diario-oracao' | 'audios' | 'plano' | 'notificacoes';

export interface UserPreferences {
  completedDevotionals: string[]; // ids
  bookmarkedDevotionals: string[]; // ids
  favoriteVerses: string[]; // ids
  planProgress: Record<string, number[]>; // planId -> completed day numbers
  activePlanId: string;
  streakDays: number;
  lastActiveDate: string;
  fontSize: 'normal' | 'large' | 'xlarge';
  journalNotes: Record<string, string>; // devotionalId or passage -> user note
  themeMode: 'parchment' | 'clean' | 'warm';
}
