import { db } from '../config/firebase';

export const deliveryService = {
  // Fetch deliveries for a specific driver
  getDeliveriesByDriver: async (driverId: string) => {
    try {
      const snapshot = await db
        .collection('deliveries')
        .where('driverId', '==', driverId)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as any,
      }));
    } catch (error) {
      console.error('Fetch Deliveries Error:', error);
      throw error;
    }
  },

  // Update delivery status
  updateDeliveryStatus: async (deliveryId: string, status: string) => {
    try {
      await db.collection('deliveries').doc(deliveryId).update({
        status: status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update Status Error:', error);
      throw error;
    }
  },

  // Listen for real-time delivery changes
  subscribeToDeliveries: (driverId: string, callback: (data: any[]) => void) => {
    return db
      .collection('deliveries')
      .where('driverId', '==', driverId)
      .onSnapshot(
        (snapshot) => {
          const deliveries = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as any,
          }));
          callback(deliveries);
        },
        (error) => {
          console.error('Delivery Subscription Error:', error);
        }
      );
  },
  seedDemoDeliveries: async (driverId: string) => {
    try {
      const demoData = [
        {
          driverId,
          customerName: 'Demo Customer A',
          address: '742 Evergreen Terrace, Springfield',
          status: 'pending',
          location: { lat: 31.5204, lng: 74.3587 },
          createdAt: new Date().toISOString(),
        },
        {
          driverId,
          customerName: 'Demo Customer B',
          address: '123 Fake Street, Lahore',
          status: 'pending',
          location: { lat: 31.4800, lng: 74.3800 },
          createdAt: new Date().toISOString(),
        }
      ];

      const batch = db.batch();
      demoData.forEach(d => {
        const docRef = db.collection('deliveries').doc();
        batch.set(docRef, d);
      });
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Seeding Error:', error);
      throw error;
    }
  },
};
