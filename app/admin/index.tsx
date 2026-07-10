import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppButton } from '@/components/ui/AppButton';
import { CustomAppBar } from '@/components/ui/CustomAppBar';
import { Screen } from '@/components/ui/Screen';
import { AppTheme } from '@/theme';

export default function AdminIndexScreen() {
  const theme = useTheme<AppTheme>();

  return (
    <>
      <CustomAppBar title="Bright Lamda Admin" onBack={() => router.back()} />
      <Screen>
        <View style={styles.container}>
          <View style={[styles.hero, { backgroundColor: theme.custom.colors.primary }]}>
            <MaterialCommunityIcons name="shield-account-outline" size={44} color={theme.custom.colors.accent} />
            <Text variant="headlineSmall" style={styles.heroTitle}>Administration workspace</Text>
            <Text variant="bodyMedium" style={styles.heroText}>
              Sign in with the role assigned to your Bright Lamda admin account.
            </Text>
          </View>
          <View style={styles.actions}>
            <AppButton icon="account-tie-outline" onPress={() => router.push('/admin/teacher-login')}>Teacher Admin Login</AppButton>
            <AppButton variant="outlined" icon="shield-crown-outline" onPress={() => router.push('/admin/system-login')}>System Admin Login</AppButton>
          </View>
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    borderRadius: 24,
    gap: 12,
    padding: 24,
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
  actions: {
    gap: 12,
  },
});
