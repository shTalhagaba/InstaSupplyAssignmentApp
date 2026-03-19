/**
 * Firestore Seeding Script
 * 
 * Instructions:
 * 1. Go to Firebase Console > Project Settings > Service Accounts.
 * 2. Click "Generate new private key" and save it as `serviceAccountKey.json` in this folder.
 * 3. Run: npm install firebase-admin
 * 4. Run: node seed_firestore.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

let YOUR_DRIVER_UID = '6GdpOj3c9rhqa3bQ9yf9eYAaLz33';
const YOUR_FCM_TOKEN = 'f-aNxgL1RiiDTT40gv0GJn:APA91bHOJYBgNcFMh4UUJ8TucrIv6QxHEiNTc_w-exogjY2PaloOt1MZedUgNLk3Jsq3KWZnxHNAGhOTCON5FSYVvig4UeuNV6VZCABIXopzOpCM4mS9Nfg';

async function seed() {
  console.log('--- Starting Firestore Seed ---');

  // 1. Seed Users Collection
  const userRef = db.collection('users').doc(YOUR_DRIVER_UID);
  await userRef.set({
    fullName: 'Driver Demo',
    email: 'driver@example.com',
    role: 'driver',
    fcmToken: YOUR_FCM_TOKEN,
    updatedAt: "2026-03-18T14:29:48.665Z"
  });
  console.log('✅ User profile updated with your FCM Token');

  // 2. Seed Deliveries Collection
  const deliveries = [
    {
      driverId: YOUR_DRIVER_UID,
      customerName: 'Demo Customer B',
      address: '123 Fake Street, Lahore',
      status: 'pending',
      location: { lat: 31.48, lng: 74.38 },
      createdAt: "2026-03-18T14:17:15.868Z"
    }
  ];

  const batch = db.batch();
  deliveries.forEach((delivery) => {
    const docRef = db.collection('deliveries').doc();
    batch.set(docRef, delivery);
  });

  await batch.commit();
  console.log('✅ 1 Delivery created with your UID');
  console.log('--- Seed Finished Successfully ---');
}

seed().catch(console.error);
