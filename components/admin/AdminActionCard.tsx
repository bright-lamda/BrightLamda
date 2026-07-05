import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, useTheme } from 'react-native-paper';
import { AdminAction } from '@/types/admin';
import { AppTheme } from '@/theme';

interface AdminActionCardProps {
  action: AdminAction;
}

export const AdminActionCard = ({ action }: AdminActionCardProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.icon, { backgroundColor: theme.colors.surfaceVariant }]}>
        <MaterialCommunityIcons name={action.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.copy}>
        <Text variant="titleSmall" style={styles.title}>{action.title}</Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{action.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  title: {
    fontWeight: '800',
  },
});
