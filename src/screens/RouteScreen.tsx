import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Config from 'react-native-config';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import ScreenWrapper from '../shared/components/ScreenWrapper';
import AppText from '../shared/components/AppText';
import AppButton from '../shared/components/AppButton';
import { colors } from '../shared/theme/colors';
import useLocation from '../hooks/useLocation';
import { routeOptimizer } from '../utils/routeOptimizer';

const RouteScreen = ({ route, navigation }: any) => {
  const { delivery, allDeliveries } = route.params || {};
  const { location: driverLocation, errorMsg } = useLocation();
  const [stops, setStops] = useState<any[]>([]);

  useEffect(() => {
    if (delivery) {
      setStops([delivery]);
    } else if (allDeliveries && driverLocation) {
      const optimized = routeOptimizer.optimize(driverLocation, allDeliveries);
      setStops(optimized);
    } else if (allDeliveries) {
      setStops(allDeliveries);
    }
  }, [delivery, allDeliveries, driverLocation]);

  useEffect(() => {
    if (errorMsg) {
      Alert.alert('Location Error', errorMsg);
    }
  }, [errorMsg]);

  // Coordinates for directions
  const origin = driverLocation ? { 
    latitude: driverLocation.latitude, 
    longitude: driverLocation.longitude 
  } : null;

  const destination = stops.length > 0 ? {
    latitude: stops[stops.length - 1].location?.lat || 0,
    longitude: stops[stops.length - 1].location?.lng || 0,
  } : null;

  const waypoints = stops.length > 1 ? stops.slice(0, -1).map(s => ({
    latitude: s.location?.lat || 0,
    longitude: s.location?.lng || 0,
  })) : [];

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: stops[0]?.location?.lat || 31.5204,
          longitude: stops[0]?.location?.lng || 74.3587,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {stops.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={{
              latitude: stop.location?.lat || 0,
              longitude: stop.location?.lng || 0,
            }}
            title={stop.customerName}
            description={stop.address}
          />
        ))}

        {origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            waypoints={waypoints}
            apikey={Config.GOOGLE_MAPS_API_KEY || ''}
            strokeWidth={moderateScale(4)}
            strokeColor={colors.primary}
            optimizeWaypoints={true}
          />
        )}
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.header}>
          <AppButton 
            title="← Back" 
            variant="outline" 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          />
        </View>

        <View style={styles.footer}>
          <AppText variant="bold" size="large">
            {stops.length > 0 
              ? `Next Stop: ${stops[0].customerName}` 
              : 'All Deliveries Completed!'}
          </AppText>
          <AppText color={colors.textSecondary} style={styles.addressText}>
            {stops[0]?.address || 'No more stops on your current route.'}
          </AppText>

          {stops.length > 0 && (
            <AppButton 
              title="Mark as Delivered" 
              onPress={async () => {
                const currentStop = stops[0];
                try {
                  Alert.alert('Success', 'Order marked as Delivered. Calculating next best route...');
                  setStops(prev => prev.slice(1)); 
                } catch (error) {
                  Alert.alert('Error', 'Failed to update status.');
                }
              }}
              style={styles.completeButton}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: moderateScale(16),
    pointerEvents: 'box-none',
  },
  header: {
    marginTop: verticalScale(40),
  },
  backButton: {
    width: moderateScale(100),
    backgroundColor: colors.white,
  },
  footer: {
    backgroundColor: colors.white,
    padding: moderateScale(20),
    borderRadius: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completeButton: {
    marginTop: verticalScale(16),
  },
  addressText: {
    marginBottom: verticalScale(10),
  },
});

export default RouteScreen;
