import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from 'react-native-paper';
import { BrandHeader } from '@/components/BrandHeader';
import { AppButton } from '@/components/ui/AppButton';
import { AppTextInput } from '@/components/ui/AppTextInput';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/hooks/useAuth';
import { LoginFormData, loginSchema } from '@/features/auth/validation';

export default function LoginScreen() {
  const auth = useAuth();
  const { control, handleSubmit, formState } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    await auth.login(data);
    router.replace('/(tabs)/home');
  });

  return (
    <Screen scroll>
      <View style={styles.container}>
        <BrandHeader title="Welcome Back" subtitle="Sign in to continue your Bright Lamda preparation." />
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <AppTextInput label="Email" keyboardType="email-address" autoCapitalize="none" value={field.value} onChangeText={field.onChange} errorText={fieldState.error?.message} />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <PasswordInput label="Password" value={field.value} onChangeText={field.onChange} errorText={fieldState.error?.message} />
            )}
          />
          <AppButton variant="ghost" compact onPress={() => router.push('/(auth)/forgot-password')}>
            Forgot password?
          </AppButton>
          <AppButton loading={formState.isSubmitting} onPress={onSubmit}>Log In</AppButton>
        </View>
        <Text style={styles.footer} onPress={() => router.push('/(auth)/register')}>
          New to Bright Lamda? Create an account
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 28,
    justifyContent: 'center',
  },
  form: {
    gap: 14,
  },
  footer: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
