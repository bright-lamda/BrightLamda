import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from 'react-native-paper';
import { AppButton } from '@/components/ui/AppButton';
import { AppTextInput } from '@/components/ui/AppTextInput';
import { CustomAppBar } from '@/components/ui/CustomAppBar';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/hooks/useAuth';
import { CompleteProfileFormData, completeProfileSchema } from '@/features/auth/validation';

export default function CompleteProfileScreen() {
  const auth = useAuth();
  const { control, handleSubmit, formState } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: { school: '', region: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    await auth.completeProfile(data);
    router.replace('/(tabs)/home');
  });

  return (
    <>
      <CustomAppBar title="Complete Profile" onBack={() => router.back()} />
      <Screen>
        <View style={styles.container}>
          <Text variant="headlineSmall" style={styles.title}>Tell us a little more</Text>
          <Controller control={control} name="school" render={({ field, fieldState }) => <AppTextInput label="School" value={field.value} onChangeText={field.onChange} errorText={fieldState.error?.message} />} />
          <Controller control={control} name="region" render={({ field, fieldState }) => <AppTextInput label="Region" value={field.value} onChangeText={field.onChange} errorText={fieldState.error?.message} />} />
          <AppButton loading={formState.isSubmitting} onPress={onSubmit}>Finish</AppButton>
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
