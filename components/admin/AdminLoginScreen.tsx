import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Text, useTheme } from 'react-native-paper';
import { AppButton } from '@/components/ui/AppButton';
import { AppTextInput } from '@/components/ui/AppTextInput';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Screen } from '@/components/ui/Screen';
import { LoginFormData, loginSchema } from '@/features/auth/validation';
import { useAuth } from '@/hooks/useAuth';
import { AppRole } from '@/types/auth';
import { AppTheme } from '@/theme';

type AdminLoginScreenProps = {
  expectedRole: Extract<AppRole, 'teacher_admin' | 'system_admin'>;
  title: string;
  subtitle: string;
  destination: '/admin/teacher' | '/admin/system';
};

export const AdminLoginScreen = ({ expectedRole, title, subtitle, destination }: AdminLoginScreenProps) => {
  const auth = useAuth();
  const theme = useTheme<AppTheme>();
  const { control, handleSubmit, formState, setError } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await auth.loginAdmin(data, expectedRole);
      router.replace(destination);
    } catch (error) {
      setError('root', { message: error instanceof Error ? error.message : 'Unable to sign in.' });
    }
  });

  return (
    <Screen scroll>
      <View style={styles.container}>
        <View style={[styles.hero, { backgroundColor: theme.custom.colors.primary }]}>
          <Text variant="headlineSmall" style={styles.heroTitle}>{title}</Text>
          <Text variant="bodyMedium" style={styles.heroText}>{subtitle}</Text>
        </View>
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <AppTextInput label="Admin email" keyboardType="email-address" autoCapitalize="none" value={field.value} onChangeText={field.onChange} errorText={fieldState.error?.message} />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => <PasswordInput label="Password" value={field.value} onChangeText={field.onChange} errorText={fieldState.error?.message} />}
          />
          {formState.errors.root?.message ? <Text style={[styles.error, { color: theme.colors.error }]}>{formState.errors.root.message}</Text> : null}
          <AppButton loading={formState.isSubmitting} onPress={onSubmit}>Log In</AppButton>
          <AppButton variant="ghost" onPress={() => router.replace('/admin')}>Back to Admin</AppButton>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    justifyContent: 'center',
  },
  hero: {
    borderRadius: 22,
    gap: 10,
    padding: 22,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
  },
  heroText: {
    color: '#E7EDF3',
    textAlign: 'center',
  },
  form: {
    gap: 14,
  },
  error: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
