import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenWrapper from '../shared/components/ScreenWrapper';
import AppText from '../shared/components/AppText';
import AppInput from '../shared/components/AppInput';
import AppButton from '../shared/components/AppButton';
import { colors } from '../shared/theme/colors';
import { authService } from '../services/authService';

const SignupScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authService.signupWithEmail(email, password);
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={moderateScale(24)} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <AppText variant="bold" size="xxlarge" color={colors.primary}>
            Create Account
          </AppText>
          <AppText variant="medium" color={colors.textSecondary}>
            Join our expert delivery fleet
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

          <AppInput
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <AppButton
            title="Register"
            onPress={handleSignup}
            loading={loading}
            style={styles.signupButton}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <AppText variant="medium" color={colors.textSecondary}>
              Already have an account? <AppText variant="bold" color={colors.primary}>Log In</AppText>
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(20),
  },
  backButton: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
  },
  header: {
    marginBottom: verticalScale(30),
  },
  form: {
    width: '100%',
  },
  signupButton: {
    marginTop: verticalScale(20),
  },
  footer: {
    marginTop: verticalScale(30),
    alignItems: 'center',
  },
});

export default SignupScreen;
