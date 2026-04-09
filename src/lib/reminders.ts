// Reminder System Utilities for NutriSihat
// Handles reminder types, defaults, and helper functions

// ============================================
// TYPES
// ============================================

export type ReminderType = 'meal' | 'medicine' | 'blood_sugar' | 'water' | 'custom';

export type ReminderDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sunday, 6=Saturday

export interface Reminder {
  id: string;
  userId: string;
  type: ReminderType;
  time: string; // HH:mm format
  title: string;
  titleBm: string;
  isActive: boolean;
  daysOfWeek: ReminderDay[];
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  medicineId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderLog {
  id: string;
  reminderId: string;
  userId: string;
  scheduledFor: string;
  completedAt?: string;
  dismissedAt?: string;
  status: 'pending' | 'completed' | 'dismissed' | 'missed';
  notes?: string;
}

export interface ReminderNotification {
  title: string;
  body: string;
  tag: string;
  data: {
    reminderId: string;
    reminderLogId?: string;
    type: ReminderType;
    url: string;
  };
}

// ============================================
// DEFAULT REMINDERS FOR ELDERLY USERS
// ============================================

export const DEFAULT_REMINDERS: Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    type: 'meal',
    time: '07:00',
    title: 'Breakfast',
    titleBm: 'Sarapan',
    isActive: true,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    soundEnabled: true,
    vibrationEnabled: true,
  },
  {
    type: 'blood_sugar',
    time: '07:30',
    title: 'Morning Blood Sugar Check',
    titleBm: 'Gula Darah Pagi',
    isActive: true,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    soundEnabled: true,
    vibrationEnabled: true,
  },
  {
    type: 'meal',
    time: '12:00',
    title: 'Lunch',
    titleBm: 'Makan Tengahari',
    isActive: true,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    soundEnabled: true,
    vibrationEnabled: true,
  },
  {
    type: 'water',
    time: '15:00',
    title: 'Afternoon Water Reminder',
    titleBm: 'Minum Air Petang',
    isActive: true,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    soundEnabled: true,
    vibrationEnabled: true,
  },
  {
    type: 'meal',
    time: '19:00',
    title: 'Dinner',
    titleBm: 'Makan Malam',
    isActive: true,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    soundEnabled: true,
    vibrationEnabled: true,
  },
  {
    type: 'blood_sugar',
    time: '19:30',
    title: 'Evening Blood Sugar Check',
    titleBm: 'Gula Darah Malam',
    isActive: true,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    soundEnabled: true,
    vibrationEnabled: true,
  },
];

// ============================================
// REMINDER LABELS (i18n)
// ============================================

export const REMINDER_TYPE_LABELS: Record<ReminderType, { en: string; bm: string; icon: string }> = {
  meal: { en: 'Meal', bm: 'Makanan', icon: '🍽️' },
  medicine: { en: 'Medicine', bm: 'Ubat', icon: '💊' },
  blood_sugar: { en: 'Blood Sugar', bm: 'Gula Darah', icon: '🩸' },
  water: { en: 'Water', bm: 'Air', icon: '💧' },
  custom: { en: 'Custom', bm: 'Lain-lain', icon: '⏰' },
};

export const DAY_LABELS: Record<ReminderDay, { en: string; bm: string; short: string }> = {
  0: { en: 'Sunday', bm: 'Ahad', short: 'Ahd' },
  1: { en: 'Monday', bm: 'Isnin', short: 'Isn' },
  2: { en: 'Tuesday', bm: 'Selasa', short: 'Sel' },
  3: { en: 'Wednesday', bm: 'Rabu', short: 'Rab' },
  4: { en: 'Thursday', bm: 'Khamis', short: 'Kha' },
  5: { en: 'Friday', bm: 'Jumaat', short: 'Jum' },
  6: { en: 'Saturday', bm: 'Sabtu', short: 'Sab' },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get the next occurrence of a reminder
 */
export function getNextReminderOccurrence(
  reminder: Pick<Reminder, 'time' | 'daysOfWeek'>
): Date {
  const now = new Date();
  const [hours, minutes] = reminder.time.split(':').map(Number);

  // Get today's reminder time
  const todayReminder = new Date(now);
  todayReminder.setHours(hours, minutes, 0, 0);

  // If today's reminder hasn't passed yet and today is an active day
  if (todayReminder > now && reminder.daysOfWeek.includes(now.getDay() as ReminderDay)) {
    return todayReminder;
  }

  // Find the next active day
  for (let i = 1; i <= 7; i++) {
    const nextDay = new Date(now);
    nextDay.setDate(now.getDate() + i);
    nextDay.setHours(hours, minutes, 0, 0);

    if (reminder.daysOfWeek.includes(nextDay.getDay() as ReminderDay)) {
      return nextDay;
    }
  }

  // Fallback (shouldn't happen if daysOfWeek is not empty)
  return todayReminder;
}

/**
 * Get the next upcoming reminder from a list
 */
export function getNextUpcomingReminder(
  reminders: Reminder[]
): { reminder: Reminder; nextOccurrence: Date } | null {
  const activeReminders = reminders.filter((r) => r.isActive);

  if (activeReminders.length === 0) {
    return null;
  }

  let next: { reminder: Reminder; nextOccurrence: Date } | null = null;

  for (const reminder of activeReminders) {
    const nextOccurrence = getNextReminderOccurrence(reminder);

    if (!next || nextOccurrence < next.nextOccurrence) {
      next = { reminder, nextOccurrence };
    }
  }

  return next;
}

/**
 * Format time for display (12-hour format with AM/PM)
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Format time remaining until reminder
 */
export function formatTimeRemaining(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff <= 0) {
    return 'Sekarang';
  }

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} hari`;
  }

  if (hours > 0) {
    return `${hours} jam ${minutes % 60 > 0 ? `${minutes % 60} minit` : ''}`;
  }

  return `${minutes} minit`;
}

/**
 * Create notification payload for a reminder
 */
export function createReminderNotification(
  reminder: Reminder,
  reminderLogId?: string
): ReminderNotification {
  const labels = REMINDER_TYPE_LABELS[reminder.type];

  return {
    title: `${labels.icon} ${reminder.titleBm}`,
    body: `Masa untuk ${reminder.titleBm.toLowerCase()}!`,
    tag: `reminder-${reminder.id}`,
    data: {
      reminderId: reminder.id,
      reminderLogId,
      type: reminder.type,
      url: getReminderUrl(reminder),
    },
  };
}

/**
 * Get the URL to navigate to when notification is clicked
 */
export function getReminderUrl(reminder: Reminder): string {
  switch (reminder.type) {
    case 'blood_sugar':
      return '/gula-darah?action=log';
    case 'medicine':
      return '/ubat?action=log';
    case 'meal':
      return '/makanan';
    case 'water':
      return '/dashboard';
    default:
      return '/dashboard';
  }
}

/**
 * Check if a reminder is due now (within 1 minute window)
 */
export function isReminderDue(reminder: Reminder): boolean {
  const now = new Date();
  const [hours, minutes] = reminder.time.split(':').map(Number);

  return (
    now.getHours() === hours &&
    now.getMinutes() === minutes &&
    reminder.isActive &&
    reminder.daysOfWeek.includes(now.getDay() as ReminderDay)
  );
}

/**
 * Get all reminders due at a specific time
 */
export function getDueReminders(
  reminders: Reminder[],
  time: string,
  dayOfWeek: number
): Reminder[] {
  return reminders.filter(
    (r) =>
      r.isActive &&
      r.time === time &&
      r.daysOfWeek.includes(dayOfWeek as ReminderDay)
  );
}

// ============================================
// PUSH NOTIFICATION HELPERS
// ============================================

/**
 * Convert VAPID public key to Uint8Array for subscription
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Convert VAPID public key to ArrayBuffer for pushManager.subscribe
 */
export function urlBase64ToArrayBuffer(base64String: string): ArrayBuffer {
  const uint8Array = urlBase64ToUint8Array(base64String);
  return uint8Array.buffer as ArrayBuffer;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const applicationServerKey = urlBase64ToArrayBuffer(vapidPublicKey);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
}

/**
 * Check if user is subscribed to push notifications
 */
export async function isPushSubscribed(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch {
    return false;
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}