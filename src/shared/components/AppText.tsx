import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { colors } from '../theme/colors';
import { fonts, fontSizes } from '../theme/fonts';

interface AppTextProps extends TextProps {
  children: React.ReactNode;
  variant?: 'regular' | 'medium' | 'bold' | 'semiBold';
  size?: keyof typeof fontSizes;
  color?: string;
}

const AppText: React.FC<AppTextProps> = ({
  children,
  variant = 'regular',
  size = 'medium',
  color = colors.text,
  style,
  ...props
}) => {
  return (
    <Text
      style={[
        {
          fontFamily: fonts[variant],
          fontSize: moderateScale(fontSizes[size]),
          color: color,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default AppText;
