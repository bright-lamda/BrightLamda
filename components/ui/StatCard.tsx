import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme } from '@/theme';

interface StatCardProps {
  label: string;
  value: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const StatCard = ({ label, value, icon }: StatCardProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <View style={[styles.card, theme.custom.shadows.card, { backgroundColor: theme.colors.surface }]}>
      <MaterialCommunityIcons name={icon} size={22} color={theme.colors.primary} />
      <Text variant="titleLarge" style={styles.value}>{value}</Text>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    flex: 1,
    gap: 8,
    padding: 16,
  },
  value: {
    fontWeight: '800',
  },
});
