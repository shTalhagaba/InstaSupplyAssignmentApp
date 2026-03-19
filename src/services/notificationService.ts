import { fcm, db } from '../config/firebase';
import { Alert, Platform } from 'react-native';
import { authService } from './authService';

export const notificationService = {
  // Initialize notifications
  init: async () => {
    try {
      const authStatus = await fcm.requestPermission();
      const enabled =
        authStatus === 1 || authStatus === 2;

      if (enabled) {
        const token = await fcm.getToken();
        const user = authService.getCurrentUser();
        if (user && token) {
          await db.collection('users').doc(user.uid).set({
            fcmToken: token,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      }
    } catch (error) {
      console.error('Notification Init Error:', error);
    }
  },

  // Listen for background/foreground messages
  attachListeners: (navigation) => {
    // Foreground
    const unsubscribeForeground = fcm.onMessage(async (remoteMessage) => {
      Alert.alert(
        remoteMessage.notification.title || 'New Notification',
        remoteMessage.notification.body
      );
    });

    // Background (Opening app from notification)
    fcm.onNotificationOpenedApp((remoteMessage) => {
      console.log('App opened from notification:', remoteMessage.data);
      if (remoteMessage.data?.type === 'NEW_DELIVERY') {
        navigation.navigate('Deliveries');
      }
    });

    // Killed state
    fcm.getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        console.log('App opened from killed state:', remoteMessage.data);
      }
    });

    return () => {
      unsubscribeForeground();
    };
  },
};
