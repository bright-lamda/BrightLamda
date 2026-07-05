import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, useTheme } from 'react-native-paper';
import { AppButton } from './AppButton';
import { AppTheme } from '@/theme';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="archive-search-outline" size={44} color={theme.colors.primary} />
      <Text variant="titleMedium" style={styles.title}>{title}</Text>
      <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>{description}</Text>
      {actionLabel ? <AppButton compact onPress={onAction}>{actionLabel}</AppButton> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
    padding: 24,
  },
  title: {
    fontWeight: '800',
  },
  description: {
    textAlign: 'center',
  },
});
