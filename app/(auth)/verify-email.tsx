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
import { VerifyEmailFormData, verifyEmailSchema } from '@/features/auth/validation';

export default function VerifyEmailScreen() {
  const { control, handleSubmit, formState } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    await authService.verifyEmail(data.code);
    router.replace('/(auth)/complete-profile');
  });

  return (
    <>
      <CustomAppBar title="Verify Email" onBack={() => router.back()} />
      <Screen>
        <View style={styles.container}>
          <Text variant="headlineSmall" style={styles.title}>Enter verification code</Text>
          <Text variant="bodyMedium">Use the code sent to your email address.</Text>
          <Controller control={control} name="code" render={({ field, fieldState }) => <AppTextInput label="Verification Code" keyboardType="number-pad" value={field.value} onChangeText={field.onChange} errorText={fieldState.error?.message} />} />
          <AppButton loading={formState.isSubmitting} onPress={onSubmit}>Verify</AppButton>
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
