import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, useTheme } from 'react-native-paper';
import { AppButton } from '@/components/ui/AppButton';
import { CustomAppBar } from '@/components/ui/CustomAppBar';
import { Screen } from '@/components/ui/Screen';
import { AppTheme } from '@/theme';

export default function AiTutorScreen() {
  const theme = useTheme<AppTheme>();

  return (
    <>
      <CustomAppBar title="Bright AI" onBack={() => router.back()} />
      <Screen>
        <View style={styles.container}>
          <View style={[styles.orb, { backgroundColor: theme.custom.colors.primary }]}>
            <MaterialCommunityIcons name="auto-fix" size={52} color={theme.custom.colors.accent} />
          </View>
          <Text variant="headlineMedium" style={styles.title}>Bright AI</Text>
          <Text variant="bodyLarge" style={[styles.copy, { color: theme.colors.onSurfaceVariant }]}>
            Your always-available Physics assistant will help with explanations, revision planning, worked reasoning, and exam preparation.
          </Text>
          <View style={[styles.panel, { backgroundColor: theme.colors.surface }]}>
            <Text variant="titleMedium" style={styles.title}>Prepared capabilities</Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Concept explanations, practice guidance, question breakdowns, and study recommendations will connect here.
            </Text>
          </View>
          <AppButton icon="message-text-outline">Start a Study Conversation</AppButton>
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 18,
    justifyContent: 'center',
  },
  orb: {
    alignItems: 'center',
    borderRadius: 999,
    height: 112,
    justifyContent: 'center',
    width: 112,
  },
  title: {
    fontWeight: '800',
    textAlign: 'center',
  },
  copy: {
    textAlign: 'center',
  },
  panel: {
    borderRadius: 20,
    gap: 8,
    padding: 18,
    width: '100%',
  },
});
