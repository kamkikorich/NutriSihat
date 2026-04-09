// Push Notification Utilities
// Handles VAPID key subscription for web push notifications

// VAPID public key from environment
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Convert VAPID public key to Uint8Array
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
 * Check if push notifications are supported
 */
export function isPushSupported(): boolean {
  return typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  if (!isPushSupported() || !VAPID_PUBLIC_KEY) {
    console.warn('Push notifications not supported or VAPID key not configured');
    return null;
  }

  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return null;
    }

    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Convert VAPID key to ArrayBuffer for type compatibility
    const applicationServerKey = urlBase64ToArrayBuffer(VAPID_PUBLIC_KEY);

    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    // Convert to JSON format
    const subscriptionJson = subscription.toJSON() as PushSubscription;

    return subscriptionJson;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  if (!isPushSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
    }

    return true;
  } catch (error) {
    console.error('Failed to unsubscribe from push notifications:', error);
    return false;
  }
}

/**
 * Check current push subscription status
 */
export async function getPushSubscriptionStatus(): Promise<boolean> {
  if (!isPushSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch (error) {
    console.error('Failed to check push subscription status:', error);
    return false;
  }
}

/**
 * Save push subscription to database via API
 */
export async function savePushSubscription(userId: string, subscription: PushSubscription): Promise<boolean> {
  try {
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        subscription,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to save push subscription:', error);
    return false;
  }
}

/**
 * Remove push subscription from database via API
 */
export async function removePushSubscription(userId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/push/subscribe', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to remove push subscription:', error);
    return false;
  }
}