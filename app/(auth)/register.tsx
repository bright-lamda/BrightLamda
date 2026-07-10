import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Linking, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Dialog, Portal, SegmentedButtons, Text } from 'react-native-paper';
import { useState } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { AppTextInput } from '@/components/ui/AppTextInput';
import { CustomAppBar } from '@/components/ui/CustomAppBar';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Screen } from '@/components/ui/Screen';
import { RegisterFormData, registerSchema } from '@/features/auth/validation';
import { useAuth } from '@/hooks/useAuth';
import { supportContacts } from '@/constants/support';

export default function RegisterScreen() {
  const auth = useAuth();
  const [adminPromptVisible, setAdminPromptVisible] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { control, handleSubmit, formState } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      whatsappNumber: '',
      password: '',
      confirmPassword: '',
      level: 'ordinary',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitError('');
      await auth.register(data);
      setAdminPromptVisible(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to create account.');
    }
  });

  const continueToSubjects = () => {
    setAdminPromptVisible(false);
    router.replace('/(auth)/subject-selection');
  };

  const saveAdminNumber = async () => {
    await Linking.openURL(supportContacts.adminWhatsAppUrl);
    continueToSubjects();
  };

  return (
    <>
      <CustomAppBar title="Create Account" onBack={() => router.back()} />
      <Screen scroll>
        <View style={styles.form}>
          <Controller control={control} name="fullName" render={({ field, fieldState }) => <AppTextInput label="Full Name" value={field.value} onChangeText={field.onChange} errorText={fieldState.error?.message} />} />
          <Controller control={control} name="email" render={({ field, fieldState }) => <AppTextInput label="Email" keyboardType="email-address" autoCapitalize="none" value={field.value} onChangeText={field.onChange} errorText={fieldState.error?.message} />} />
          <Controller control={control} name="whatsappNumber" render={({ field, fieldState }) => <AppTextInput label="WhatsApp Phone Number" keyboardType="phone-pad" value={field.value} onChangeText={field.onChange} errorText={fieldState.error?.message} />} />
          <Controller control={control} name="password" render={({ field, fieldState }) => <PasswordInput label="Password" value={field.value} onChangeText={field.onChange} errorText={fieldState.error?.message} />} />
          <Controller control={control} name="confirmPassword" render={({ field, fieldState }) => <PasswordInput label="Confirm Password" value={field.value} onChangeText={field.onChange} errorText={fieldState.error?.message} />} />
          <Controller
            control={control}
            name="level"
            render={({ field, fieldState }) => (
              <View style={styles.levelBlock}>
                <Text variant="labelLarge">Learning category</Text>
                <SegmentedButtons
                  value={field.value}
                  onValueChange={field.onChange}
                  buttons={[
                    { value: 'ordinary', label: 'Ordinary' },
                    { value: 'advanced', label: 'Advanced' },
                    { value: 'competitive', label: 'Competitive' },
                  ]}
                />
                <Text variant="bodySmall">Competitive covers FET, Polytechnic, ENS, ENSET, and other entrance exams.</Text>
                {fieldState.error ? <Text style={styles.error}>{fieldState.error.message}</Text> : null}
              </View>
            )}
          />
          {submitError ? <Text style={styles.error}>{submitError}</Text> : null}
          <AppButton loading={formState.isSubmitting} onPress={onSubmit}>Continue</AppButton>
        </View>
      </Screen>
      <Portal>
        <Dialog visible={adminPromptVisible} dismissable={false}>
          <Dialog.Title>Save the admin WhatsApp number?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Bright Lamda can send important support updates through WhatsApp. Do you want to save or open the admin contact now?
            </Text>
            <Text variant="labelLarge" style={styles.adminNumber}>{supportContacts.adminWhatsAppNumber}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={continueToSubjects}>Not now</Button>
            <Button onPress={saveAdminNumber}>Save number</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 14,
  },
  levelBlock: {
    gap: 8,
  },
  error: {
    color: '#B94A48',
    fontSize: 12,
    fontWeight: '600',
  },
  adminNumber: {
    marginTop: 12,
  },
});

