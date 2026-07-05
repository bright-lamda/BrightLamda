import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { BrandHeader } from '@/components/BrandHeader';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';

export default function WelcomeScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <BrandHeader />
        <View style={styles.actions}>
          <AppButton onPress={() => router.push('/(auth)/login')}>Log In</AppButton>
          <AppButton variant="outlined" onPress={() => router.push('/(auth)/register')}>Create Account</AppButton>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 44,
  },
  actions: {
    gap: 12,
  },
});
