import { PrayerEntry, PrayerReminder } from '../types';
import { soundSynthesizer } from './audioEngine';

/**
 * Formats a Date object to iCalendar ISO 8601 UTC string (YYYYMMDDTHHmmssZ) or local format
 */
const formatIcsDate = (date: Date): string => {
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
};

/**
 * Creates start and end dates from reminder date and time
 */
export const getReminderDates = (
  scheduledDate: string,
  scheduledTime: string,
  durationMinutes = 15
): { startDate: Date; endDate: Date } => {
  const [year, month, day] = scheduledDate.split('-').map(Number);
  const [hours, minutes] = scheduledTime.split(':').map(Number);

  const startDate = new Date(year, month - 1, day, hours, minutes, 0);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

  return { startDate, endDate };
};

/**
 * Generates a direct Google Calendar Web URL pre-filled with the prayer reminder
 */
export const generateGoogleCalendarUrl = (
  prayer: PrayerEntry,
  reminder: PrayerReminder
): string => {
  const { startDate, endDate } = getReminderDates(reminder.scheduledDate, reminder.scheduledTime);

  const startIso = formatIcsDate(startDate);
  const endIso = formatIcsDate(endDate);

  const title = `Momento de Oração: ${prayer.title}`;
  const details = [
    `Pedido de Oração registrado no Devocional Diário:`,
    prayer.title,
    `\nMotivo / Súplica:`,
    prayer.description,
    reminder.notes ? `\nFoco Específico: ${reminder.notes}` : '',
    `\n"Em tudo, pela oração e pela súplica, com ações de graças, sejam conhecidas diante de Deus as vossas petições." - Filipenses 4:6`,
  ]
    .filter(Boolean)
    .join('\n');

  let url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${startIso}/${endIso}&details=${encodeURIComponent(details)}`;

  if (reminder.frequency === 'daily') {
    url += `&recur=${encodeURIComponent('RRULE:FREQ=DAILY')}`;
  } else if (reminder.frequency === 'weekdays') {
    url += `&recur=${encodeURIComponent('RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR')}`;
  }

  return url;
};

/**
 * Generates and triggers download of an .ics iCalendar file with alarms for local calendars
 * (Apple Calendar, Outlook, Android, Google Calendar)
 */
export const downloadIcsCalendarFile = (
  prayer: PrayerEntry,
  reminder: PrayerReminder
): void => {
  const { startDate, endDate } = getReminderDates(reminder.scheduledDate, reminder.scheduledTime);
  const startStr = formatIcsDate(startDate);
  const endStr = formatIcsDate(endDate);
  const nowStr = formatIcsDate(new Date());

  const summary = `Momento de Oração: ${prayer.title}`;
  const description = [
    `Pedido de Oração no Devocional Diário:\\n${prayer.title}`,
    `\\nMotivo:\\n${prayer.description.replace(/\n/g, '\\n')}`,
    reminder.notes ? `\\nFoco:\\n${reminder.notes.replace(/\n/g, '\\n')}` : '',
  ]
    .filter(Boolean)
    .join('\\n');

  let rruleLine = '';
  if (reminder.frequency === 'daily') {
    rruleLine = 'RRULE:FREQ=DAILY\n';
  } else if (reminder.frequency === 'weekdays') {
    rruleLine = 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR\n';
  }

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Devocional Diario//Diario de Oracao//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:prayer-reminder-${prayer.id}-${Date.now()}@devocionaldiario.app`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    rruleLine.trim(),
    'STATUS:CONFIRMED',
    // Notification alarm in calendar
    'BEGIN:VALARM',
    'TRIGGER:-PT0M', // At time of event
    'ACTION:DISPLAY',
    `DESCRIPTION:Hora de orar por: ${prayer.title}`,
    'END:VALARM',
    // 5 minutes before alarm
    'BEGIN:VALARM',
    'TRIGGER:-PT5M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Em 5 min: Momento de Oração por ${prayer.title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  const sanitizedTitle = prayer.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .slice(0, 30);
  anchor.download = `oracao-${sanitizedTitle}-${reminder.scheduledTime.replace(':', '')}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
};

/**
 * Checks Notification API support and current permission status
 */
export const checkBrowserNotificationSupport = (): {
  supported: boolean;
  permission: NotificationPermission;
} => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { supported: false, permission: 'denied' };
  }
  return { supported: true, permission: Notification.permission };
};

/**
 * Requests browser permission for scheduled notifications
 */
export const requestBrowserNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      soundSynthesizer.playChime();
      new Notification('Lembretes de Oração Ativados! 🕊️', {
        body: 'Você receberá notificações suaves para orar pelos seus motivos agendados.',
        icon: '/favicon.ico',
      });
    }
    return perm;
  } catch (error) {
    console.warn('Erro ao solicitar permissão de notificações:', error);
    return 'denied';
  }
};

/**
 * Triggers an immediate browser notification for prayer
 */
export const triggerPrayerBrowserNotification = (
  prayer: PrayerEntry,
  reminderNotes?: string
): boolean => {
  soundSynthesizer.playChime();

  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`Momento de Clamor: ${prayer.title} 🕊️`, {
        body: reminderNotes
          ? `${reminderNotes}\n"${prayer.description.slice(0, 100)}..."`
          : `Separe este momento para interceder: "${prayer.title}"`,
        icon: '/favicon.ico',
        tag: `prayer-${prayer.id}`,
      });
      return true;
    } catch (err) {
      console.warn('Erro ao disparar notificação do navegador:', err);
      return false;
    }
  }
  return false;
};
