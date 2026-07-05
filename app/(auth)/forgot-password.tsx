import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from 'react-native-paper';
import { AppButton } from '@/components/ui/AppButton';
import { AppTextInput } from '@/components/ui/AppTextInput';
import { CustomAppBar } from '@/components/ui/CustomAppBar';
import { Screen } from '@/components/ui/Screen';
import { authService } from '@/services/authService';
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/features/auth/validation';

export default function ForgotPasswordScreen() {
  const { control, handleSubmit, formState } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    await authService.forgotPassword(data.email);
    router.push('/(auth)/verify-email');
  });

  return (
    <>
      <CustomAppBar title="Reset Password" onBack={() => router.back()} />
      <Screen>
        <View style={styles.container}>
          <Text variant="headlineSmall" style={styles.title}>Recover your account</Text>
          <Text variant="bodyMedium">Enter your email and Bright Lamda will send a verification code.</Text>
          <Controller control={control} name="email" render={({ field, fieldState }) => <AppTextInput label="Email" keyboardType="email-address" value={field.value} onChangeText={field.onChange} errorText={fieldState.error?.message} />} />
          <AppButton loading={formState.isSubmitting} onPress={onSubmit}>Send Code</AppButton>
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    fontWeight: '800',
  },
});
