import { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { AppTheme } from '@/theme';

interface AppTextInputProps extends ComponentProps<typeof TextInput> {
  errorText?: string;
}

export const AppTextInput = ({ errorText, style, ...props }: AppTextInputProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        outlineColor={theme.colors.outline}
        activeOutlineColor={theme.colors.primary}
        style={[styles.input, { backgroundColor: theme.colors.surface }, style]}
        error={Boolean(errorText)}
        {...props}
      />
      {errorText ? <Text style={[styles.error, { color: theme.colors.error }]}>{errorText}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  input: {
    minHeight: 56,
  },
  error: {
    fontSize: 12,
    fontWeight: '600',
  },
});
