import admin, { messaging } from 'firebase-admin';

import { firebaseConfig } from '../config';

export interface FirebaseNotificationPayload {
  topic?: string;
  tokenId: string;
  title: string;
  body: string;
  image?: string;
  data: {
    json_data: string;
    alias: string;
  };
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: firebaseConfig.baseUrl,
});

async function sendMessage(message: messaging.Message) {
  try {
    const messageId = await admin.messaging().send(message);
    return messageId;
  } catch (error) {
    console.log(error);
  }
}

async function sendToUser(notification: FirebaseNotificationPayload) {
  const message: messaging.Message = {
    token: notification.tokenId,
    notification: {
      title: notification.title,
      body: notification.body,
      imageUrl: notification.image || undefined,
    },
    data: {
      ...notification.data,
    },
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
        },
      },
      headers: {
        'apns-push-type': 'background',
        'apns-priority': '5',
        'apns-topic': 'com.rotery.rotery',
      },
    },
    android: {
      priority: 'high',
      notification: {
        defaultSound: true,
        defaultVibrateTimings: true,
        vibrateTimingsMillis: [500, 1000, 500, 1000],
      },
    },
  };

  await sendMessage(message);
}

export { sendToUser };
