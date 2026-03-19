import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../theme/colors';
import AppText from './AppText';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <AppText variant="medium" style={styles.label}>{label}</AppText>}
      <View style={[styles.inputContainer, error ? { borderColor: colors.error } : {}]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
      </View>
      {error && <AppText color={colors.error} size="small" style={styles.errorText}>{error}</AppText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: verticalScale(16),
  },
  label: {
    marginBottom: verticalScale(6),
  },
  inputContainer: {
    height: verticalScale(48),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  input: {
    fontSize: moderateScale(14),
    color: colors.text,
  },
  errorText: {
    marginTop: verticalScale(4),
  },
});

export default AppInput;
