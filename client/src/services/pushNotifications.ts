import { api } from './api';

// Convert VAPID base64 public key to Uint8Array for PushManager
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

// Check if running on iOS (iPhone / iPad / iPod)
export function isIos(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
  const isMacTouch = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return isIosDevice || isMacTouch;
}

// Check if app is running in Standalone PWA mode (added to Home Screen)
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const isNavigatorStandalone = (window.navigator as any).standalone === true;
  const isDisplayStandalone = window.matchMedia('(display-mode: standalone)').matches;
  return isNavigatorStandalone || isDisplayStandalone;
}

// Check if Push Notifications are supported on current platform
export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

// Register service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    return registration;
  } catch (err) {
    console.error('[PWA] Service worker registration failed:', err);
    return null;
  }
}

// Get notification permission state
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

// Check active subscription
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  try {
    const reg = await navigator.serviceWorker.ready;
    return await reg.pushManager.getSubscription();
  } catch (err) {
    console.error('[Push] Error getting subscription:', err);
    return null;
  }
}

// Request permission and subscribe device to Web Push
export async function subscribeToPush(role: 'admin' | 'customer' = 'customer'): Promise<{
  success: boolean;
  subscription?: PushSubscription;
  error?: string;
}> {
  if (!isPushSupported()) {
    if (isIos() && !isStandalone()) {
      return {
        success: false,
        error: 'ON_IOS_MUST_ADD_TO_HOME_SCREEN',
      };
    }
    return {
      success: false,
      error: 'Web Push is not supported on this browser or device.',
    };
  }

  try {
    // 1. Explicit user gesture permission request (Required by iOS 16.4+)
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        success: false,
        error: 'Notification permission was denied or dismissed.',
      };
    }

    // 2. Fetch VAPID public key
    const vapidKeyData = await api.getVapidKey();
    if (!vapidKeyData?.publicKey) {
      throw new Error('Could not retrieve VAPID public key from server.');
    }

    // 3. Register SW and subscribe via pushManager
    const reg = await navigator.serviceWorker.ready;
    let subscription = await reg.pushManager.getSubscription();

    if (!subscription) {
      const convertedVapidKey = urlBase64ToUint8Array(vapidKeyData.publicKey);
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey as unknown as BufferSource,
      });
    }

    // 4. Send subscription to backend
    const deviceType = isIos() ? 'ios' : /android/i.test(navigator.userAgent) ? 'android' : 'desktop';
    await api.subscribePush({
      subscription: subscription.toJSON(),
      role,
      device: deviceType,
      userAgent: navigator.userAgent,
    });

    return { success: true, subscription };
  } catch (err: any) {
    console.error('[Push] Subscription failed:', err);
    return { success: false, error: err?.message || 'Failed to subscribe to push notifications' };
  }
}

// Unsubscribe
export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await api.unsubscribePush(sub.endpoint);
      await sub.unsubscribe();
    }
    return true;
  } catch (err) {
    console.error('[Push] Error unsubscribing:', err);
    return false;
  }
}

// Send test push to verify
export async function sendTestPush(): Promise<any> {
  const sub = await getCurrentSubscription();
  return api.sendTestPush(sub ? sub.toJSON() : undefined);
}
