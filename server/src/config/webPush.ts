import webpush from 'web-push';
import dotenv from 'dotenv';
import { PushSubscription } from '../models/PushSubscription';

dotenv.config();

const VAPID_PUBLIC_KEY =
  process.env.VAPID_PUBLIC_KEY ||
  'BCHl22u8KFegywHA9QcYkYxKLFhzh1MDa21f15Y9Y7W_870KIZa0Q0zUQj2puec9-mbqc43Eaa8GnsuXKePEyqk';

const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY || '1dAEycrOdH1jordAP4RVwCgpt2LlZFkTxVjXQ4XE_0M';

const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:byhadab@gmail.com';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
  data?: Record<string, any>;
}

export const getVapidPublicKey = (): string => VAPID_PUBLIC_KEY;

export const sendPushNotification = async (
  sub: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: PushNotificationPayload
) => {
  const payloadString = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon || '/apple-touch-icon.png',
    badge: payload.badge || '/apple-touch-icon.png',
    url: payload.url || '/',
    tag: payload.tag || 'hadab-general',
    data: payload.data || {},
  });

  try {
    await webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.keys.p256dh,
          auth: sub.keys.auth,
        },
      },
      payloadString
    );
    return { success: true };
  } catch (err: any) {
    console.error(`[WebPush Error] Endpoint ${sub.endpoint.slice(-15)}:`, err?.statusCode || err?.message);
    // If Apple Push service or Google reports 404 or 410 (Gone), delete subscription
    if (err?.statusCode === 404 || err?.statusCode === 410) {
      console.log(`[WebPush] Removing expired subscription: ${sub.endpoint.slice(-15)}`);
      await PushSubscription.deleteOne({ endpoint: sub.endpoint });
    }
    return { success: false, error: err?.message };
  }
};

/**
 * Send push notification to all devices registered under a specific role (e.g. 'admin')
 */
export const sendPushToRole = async (
  role: 'admin' | 'customer',
  payload: PushNotificationPayload
) => {
  try {
    const subscriptions = await PushSubscription.find({ role });
    if (!subscriptions.length) {
      console.log(`[WebPush] No active subscriptions found for role: ${role}`);
      return { sent: 0, total: 0 };
    }

    const results = await Promise.allSettled(
      subscriptions.map((sub) => sendPushNotification(sub, payload))
    );

    const successful = results.filter(
      (r) => r.status === 'fulfilled' && (r.value as any)?.success
    ).length;

    console.log(`[WebPush] Sent to role ${role}: ${successful}/${subscriptions.length} delivered`);
    return { sent: successful, total: subscriptions.length };
  } catch (error) {
    console.error(`[WebPush] Error sending to role ${role}:`, error);
    return { sent: 0, total: 0, error };
  }
};

/**
 * Send push notification to a specific user by userId
 */
export const sendPushToUser = async (
  userId: string,
  payload: PushNotificationPayload
) => {
  try {
    const subscriptions = await PushSubscription.find({ userId });
    if (!subscriptions.length) return { sent: 0, total: 0 };

    const results = await Promise.allSettled(
      subscriptions.map((sub) => sendPushNotification(sub, payload))
    );

    const successful = results.filter(
      (r) => r.status === 'fulfilled' && (r.value as any)?.success
    ).length;

    return { sent: successful, total: subscriptions.length };
  } catch (error) {
    console.error(`[WebPush] Error sending to user ${userId}:`, error);
    return { sent: 0, total: 0, error };
  }
};

export { webpush };
