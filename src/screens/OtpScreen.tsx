import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import ScreenWrapper from '../shared/components/ScreenWrapper';
import AppText from '../shared/components/AppText';
import AppButton from '../shared/components/AppButton';
import { colors } from '../shared/theme/colors';
import { authService } from '../services/authService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OtpScreen = ({ navigation, onVerified }: any) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendLink = async () => {
    setLoading(true);
    try {
      await authService.sendEmailVerification();
      setSent(true);
      Alert.alert('Link Sent', 'A verification link has been sent to your email address.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    try {
      const isVerified = authService.isEmailVerified();
      if (isVerified) {
        Alert.alert('Verified', 'Email successfully verified!', [
          { text: 'Continue', onPress: () => onVerified && onVerified() }
        ]);
      } else {
        Alert.alert(
          'Not Verified', 
          'We couldn\'t verify your email yet. Please click the link in the email and then try again.'
        );
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to check verification status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={moderateScale(24)} color={colors.primary} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Icon 
          name={!sent ? "email-lock" : "email-check"} 
          size={moderateScale(80)} 
          color={colors.primary} 
        />
        <AppText variant="bold" size="xxlarge" color={colors.primary} style={styles.title}>
          {!sent ? 'Verify Account' : 'Check Inbox'}
        </AppText>
        <AppText variant="medium" color={colors.textSecondary} style={styles.subtitle}>
          {!sent 
            ? 'To ensure security, please verify your email address before accessing the driver portal.' 
            : 'We just sent a verification link to your email. Please click it to continue.'}
        </AppText>
      </View>

      <View style={styles.form}>
        {!sent ? (
          <AppButton 
            title="Send Verification Email" 
            onPress={handleSendLink} 
            loading={loading}
            style={styles.actionButton}
          />
        ) : (
          <>
            <AppButton 
              title="I've Clicked the Link" 
              onPress={handleCheckVerification} 
              loading={loading}
              style={styles.actionButton}
            />
            <AppButton 
              title="Resend Email" 
              variant="outline"
              onPress={handleSendLink} 
              loading={loading}
              style={styles.resendButton}
            />

            <TouchableOpacity 
              onPress={() => onVerified && onVerified()} 
              style={styles.bypassLink}
            >
              <AppText color={colors.textSecondary} size="small">
                Skip for Testing
              </AppText>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(20),
    justifyContent: 'center',
  },
  backButton: {
    marginBottom: verticalScale(20),
    position: 'absolute',
    top: verticalScale(50),
    left: moderateScale(20),
  },
  header: {
    marginBottom: verticalScale(40),
    alignItems: 'center',
  },
  title: {
    marginTop: verticalScale(20),
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: verticalScale(10),
    paddingHorizontal: moderateScale(10),
  },
  form: {
    width: '100%',
    marginTop: verticalScale(20),
  },
  actionButton: {
    height: verticalScale(50),
  },
  resendButton: {
    marginTop: verticalScale(15),
    height: verticalScale(50),
  },
  bypassLink: {
    marginTop: verticalScale(30),
    alignItems: 'center',
  },
});

export default OtpScreen;
