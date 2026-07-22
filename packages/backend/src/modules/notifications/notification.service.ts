import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../utils/errors.js';
import { getMessaging } from '../../config/firebase.js';

export async function updateFcmToken(userId: string, token: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { fcmToken: token },
  });
}

export async function sendToUser(userId: string, title: string, body: string, data?: Record<string, string>) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.fcmToken) throw new NotFoundError('User or FCM token');

  try {
    await getMessaging().send({
      token: user.fcmToken,
      notification: { title, body },
      data,
    });
  } catch (error) {
    // Token might be invalid — clear it
    if ((error as any)?.code === 'messaging/invalid-registration-token' ||
        (error as any)?.code === 'messaging/registration-token-not-registered') {
      await prisma.user.update({
        where: { id: userId },
        data: { fcmToken: null },
      });
    }
    throw error;
  }
}

export async function sendToTenant(tenantId: string, title: string, body: string, data?: Record<string, string>) {
  const users = await prisma.user.findMany({
    where: { tenantId, isActive: true, fcmToken: { not: null } },
  });

  const messages = users
    .filter((u) => u.fcmToken)
    .map((u) => ({
      token: u.fcmToken!,
      notification: { title, body },
      data,
    }));

  if (messages.length === 0) return;

  const messaging = getMessaging();
  await Promise.allSettled(messages.map((msg) => messaging.send(msg)));
}
