/**
 * Simple Nearest Neighbor algorithm for route optimization.
 * In a production app, you might use the Google Directions API (Waypoints optimization).
 */

export const routeOptimizer = {
  optimize: (currentLocation: any, deliveries: any[]) => {
    if (!currentLocation || !deliveries || deliveries.length === 0) return [];

    // Filter only pending/picked up deliveries
    const activeDeliveries = deliveries.filter(d => d.status !== 'Delivered');
    if (activeDeliveries.length === 0) return [];

    let unvisited = [...activeDeliveries];
    let optimized: any[] = [];
    let currentPos = currentLocation;

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let minScore = Infinity;

      unvisited.forEach((delivery, index) => {
        const dist = Math.sqrt(
          Math.pow(delivery.location.lat - currentPos.latitude, 2) +
          Math.pow(delivery.location.lng - currentPos.longitude, 2)
        );
        
        // Simulating Real-World Parameters:
        // We add a random/simulated "trafficMultiplier" (between 1.0 and 2.5)
        // In a real app, this would come from a Maps API (Traffic layer)
        const trafficFactor = delivery.trafficMultiplier || (Math.random() * 1.5 + 1.0);
        const timePriority = delivery.isPriority ? 0.7 : 1.0; // Priority orders get 30% "closer"
        
        const score = dist * trafficFactor * timePriority;

        if (score < minScore) {
          minScore = score;
          nearestIndex = index;
        }
      });

      const nextStop = unvisited.splice(nearestIndex, 1)[0];
      optimized.push(nextStop);
      currentPos = { 
        latitude: nextStop.location.lat, 
        longitude: nextStop.location.lng 
      };
    }

    return optimized;
  },
};

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};
