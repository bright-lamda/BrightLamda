import { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { AppTheme } from '@/theme';

type ButtonMode = 'primary' | 'secondary' | 'outlined' | 'ghost';

interface AppButtonProps extends Omit<ComponentProps<typeof Button>, 'mode'> {
  variant?: ButtonMode;
}

export const AppButton = ({ variant = 'primary', style, labelStyle, contentStyle, ...props }: AppButtonProps) => {
  const theme = useTheme<AppTheme>();
  const mode = variant === 'outlined' ? 'outlined' : variant === 'ghost' ? 'text' : 'contained';
  const isSecondary = variant === 'secondary';

  return (
    <Button
      mode={mode}
      buttonColor={isSecondary ? theme.custom.colors.accent : variant === 'primary' ? theme.colors.primary : undefined}
      textColor={isSecondary ? theme.custom.colors.primary : variant === 'primary' ? theme.colors.onPrimary : undefined}
      style={[styles.button, style]}
      contentStyle={[styles.content, contentStyle]}
      labelStyle={[styles.label, labelStyle]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
  },
  content: {
    minHeight: 52,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
});
