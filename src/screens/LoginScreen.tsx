import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import ScreenWrapper from '../shared/components/ScreenWrapper';
import AppText from '../shared/components/AppText';
import AppInput from '../shared/components/AppInput';
import AppButton from '../shared/components/AppButton';
import { colors } from '../shared/theme/colors';
import { authService } from '../services/authService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await authService.loginWithEmail(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Icon name="truck-delivery" size={moderateScale(60)} color={colors.primary} />
        <AppText variant="bold" size="xxlarge" color={colors.primary} style={styles.title}>
          Driver Hub
        </AppText>
        <AppText variant="medium" color={colors.textSecondary}>
          Expert Delivery Logistics
        </AppText>
      </View>

      <View style={styles.form}>
        <AppInput
          label="Email Address"
          placeholder="example@delivery.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <AppButton
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          style={styles.loginButton}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signupLink}>
          <AppText variant="medium" color={colors.textSecondary}>
            Don't have an account? <AppText variant="bold" color={colors.primary}>Sign Up</AppText>
          </AppText>
        </TouchableOpacity>
        
        <AppText variant="regular" size="small" color={colors.textSecondary} style={styles.terms}>
          By logging in, you agree to our Terms and Conditions.
        </AppText>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(20),
    justifyContent: 'center',
  },
  header: {
    marginBottom: verticalScale(40),
    alignItems: 'center',
  },
  title: {
    marginTop: verticalScale(10),
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: verticalScale(10),
  },
  footer: {
    marginTop: verticalScale(40),
    alignItems: 'center',
  },
  signupLink: {
    marginBottom: verticalScale(20),
  },
  terms: {
    textAlign: 'center',
  },
});

export default LoginScreen;
