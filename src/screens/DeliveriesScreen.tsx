import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import ScreenWrapper from '../shared/components/ScreenWrapper';
import AppText from '../shared/components/AppText';
import AppButton from '../shared/components/AppButton';
import { colors } from '../shared/theme/colors';
import { deliveryService } from '../services/deliveryService';
import { authService } from '../services/authService';

const DeliveriesScreen = ({ navigation }: any) => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (!currentUser) return;

    // Real-time subscription to deliveries
    const unsubscribe = deliveryService.subscribeToDeliveries(
      currentUser.uid,
      (data: any) => {
        setDeliveries(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout Failed:', error);
    }
  };

  const renderDeliveryItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <AppText variant="bold" size="large">Order #{item.id.slice(-5)}</AppText>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: item.status === 'pending' ? colors.pending : colors.success }
        ]}>
          <AppText size="small" color={colors.white} variant="medium">
            {item.status.toUpperCase()}
          </AppText>
        </View>
      </View>
      
      <AppText color={colors.textSecondary} style={styles.cardDetail}>
        Customer: <AppText variant="medium">{item.customerName}</AppText>
      </AppText>
      <AppText color={colors.textSecondary} style={styles.cardDetail}>
        Address: <AppText variant="medium">{item.address}</AppText>
      </AppText>

      <AppButton
        title="View on Map"
        variant="outline"
        onPress={() => navigation.navigate('Route', { delivery: item })}
        style={styles.cardButton}
      />
    </View>
  );

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <View>
          <AppText variant="bold" size="xlarge">Assigned Deliveries</AppText>
          <AppText color={colors.textSecondary}>Manage your route and tasks</AppText>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <AppText color={colors.primary} variant="bold">Logout</AppText>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={deliveries}
          renderItem={renderDeliveryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <AppText color={colors.textSecondary} style={styles.emptyText}>
                No deliveries assigned to you today.
              </AppText>
              <AppButton
                title="Generate Demo Data"
                variant="outline"
                loading={loading}
                onPress={async () => {
                  if (currentUser) {
                    setLoading(true);
                    await deliveryService.seedDemoDeliveries(currentUser.uid);
                    setLoading(false);
                  }
                }}
                style={styles.seedButton}
              />
            </View>
          }
        />
      )}

      <AppButton
        title="Optimise Route"
        onPress={() => navigation.navigate('Route', { allDeliveries: deliveries })}
        style={styles.optimiseButton}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: verticalScale(20),
  },
  listContent: {
    paddingBottom: verticalScale(80),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  statusBadge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(4),
  },
  cardDetail: {
    marginBottom: verticalScale(4),
  },
  cardButton: {
    marginTop: verticalScale(12),
    height: verticalScale(36),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    marginTop: verticalScale(100),
    alignItems: 'center',
    paddingHorizontal: moderateScale(40),
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  seedButton: {
    width: '100%',
  },
  optimiseButton: {
    position: 'absolute',
    bottom: verticalScale(20),
    left: moderateScale(16),
    right: moderateScale(16),
  },
});

export default DeliveriesScreen;
