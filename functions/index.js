const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Triggered when a new delivery document is created in Firestore.
 * Requirements: Handle notifications in foreground, background, and killed states.
 */
exports.notifyDriverOnNewDelivery = functions.firestore
  .document('deliveries/{deliveryId}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    const driverId = data.driverId;

    if (!driverId) {
      console.log('No driverId found in delivery document.');
      return null;
    }

    try {
      // 1. Get the driver's FCM token from the users collection
      const userDoc = await admin.firestore().collection('users').doc(driverId).get();
      
      if (!userDoc.exists) {
        console.log(`User ${driverId} not found in Firestore.`);
        return null;
      }

      const userData = userDoc.data();
      const fcmToken = userData.fcmToken;

      if (!fcmToken) {
        console.log(`No FCM token found for driver ${driverId}.`);
        return null;
      }

      // 2. Prepare the notification payload
      const payload = {
        notification: {
          title: 'New Delivery Assigned! 📦',
          body: `Head to ${data.address} for your next delivery.`,
        },
        data: {
          type: 'NEW_DELIVERY',
          deliveryId: context.params.deliveryId,
          click_action: 'FLUTTER_NOTIFICATION_CLICK', // Common for React Native too
        },
        token: fcmToken,
      };

      // 3. Send the notification
      const response = await admin.messaging().send(payload);
      console.log('Successfully sent notification:', response);
      return response;

    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  });
