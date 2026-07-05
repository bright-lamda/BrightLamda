import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, useTheme } from 'react-native-paper';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AppTheme } from '@/theme';

const quizTracks = [
  {
    title: 'Weekly Physics Quiz',
    detail: 'Timed challenge for your current learning category.',
    icon: 'timer-outline',
    tone: '#D4A3FF',
  },
  {
    title: 'Topic Practice',
    detail: 'Focused questions for mechanics, electricity, waves, and practical Physics.',
    icon: 'target-variant',
    tone: '#9FD7FF',
  },
  {
    title: 'Competition Drill',
    detail: 'Entrance-style Physics questions for FET, Polytechnic, ENS, and ENSET preparation.',
    icon: 'trophy-outline',
    tone: '#FFE1A6',
  },
] as const;

export default function QuizScreen() {
  const theme = useTheme<AppTheme>();

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Quiz</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Practice, compete, and track mastery through weekly and topic-based Physics challenges.
        </Text>
      </View>

      <View style={[styles.hero, { backgroundColor: theme.custom.colors.primary }]}>
        <Text variant="labelLarge" style={styles.heroMeta}>Next challenge</Text>
        <Text variant="titleLarge" style={styles.heroTitle}>Mechanics mastery round</Text>
        <Text variant="bodyMedium" style={styles.heroText}>Questions unlock Friday with instant progress feedback and ranking preview.</Text>
      </View>

      <SectionHeader title="Quiz Modes" />
      <View style={styles.list}>
        {quizTracks.map((track) => (
          <View key={track.title} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.icon, { backgroundColor: track.tone }]}>
              <MaterialCommunityIcons name={track.icon} size={24} color={theme.custom.colors.primary} />
            </View>
            <View style={styles.copy}>
              <Text variant="titleSmall" style={styles.title}>{track.title}</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{track.detail}</Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
    marginBottom: 18,
  },
  title: {
    fontWeight: '800',
  },
  hero: {
    borderRadius: 22,
    gap: 8,
    marginBottom: 24,
    padding: 20,
  },
  heroMeta: {
    color: '#D4A3FF',
    fontWeight: '800',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  heroText: {
    color: '#E7EDF3',
  },
  list: {
    gap: 12,
    marginTop: 12,
    paddingBottom: 78,
  },
  card: {
    alignItems: 'center',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
});
