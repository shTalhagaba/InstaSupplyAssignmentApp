import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { firebaseAuth } from '../config/firebase';
import { notificationService } from '../services/notificationService';

// Screens
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import SignupScreen from '../screens/SignupScreen';
import DeliveriesScreen from '../screens/DeliveriesScreen';
import RouteScreen from '../screens/RouteScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Handle user state changes
  function onAuthStateChanged(userAuth: any) {
    setUser(userAuth);
    if (userAuth) {
      setIsPhoneVerified(userAuth.emailVerified);
    } else {
      setIsPhoneVerified(false);
    }
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    notificationService.init();
    const subscriber = firebaseAuth.onAuthStateChanged(onAuthStateChanged);
    return () => {
      subscriber();
    };
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // 1. Email/Signup Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : !isPhoneVerified ? (
          // 2. Phone Verification Stack (After Email Login)
          <Stack.Screen name="Otp">
            {(props) => <OtpScreen {...props} onVerified={() => setIsPhoneVerified(true)} />}
          </Stack.Screen>
        ) : (
          // 3. Main App Stack (After Phone Verified)
          <>
            <Stack.Screen name="Deliveries" component={DeliveriesScreen} />
            <Stack.Screen name="Route" component={RouteScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
