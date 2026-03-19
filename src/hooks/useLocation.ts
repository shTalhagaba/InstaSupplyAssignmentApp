import { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';

interface Location {
  latitude: number;
  longitude: number;
}

const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setErrorMsg('Permission to access location was denied');
          return;
        }
      }
      
      getCurrentLocation();
      const watchId = Geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => setErrorMsg(error.message),
        { enableHighAccuracy: true, distanceFilter: 10 }
      );

      return () => Geolocation.clearWatch(watchId);
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => setErrorMsg(error.message),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    requestPermission();
  }, []);

  return { location, errorMsg };
};

export default useLocation;
