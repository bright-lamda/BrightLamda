import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import { FeedItem, FeedSenderRole } from '@/constants/feed';
import { AppTheme } from '@/theme';

interface FeedCardProps {
  item: FeedItem;
}

export const FeedCard = ({ item }: FeedCardProps) => {
  const theme = useTheme<AppTheme>();
  const role = roleMeta(item.sender.role);

  return (
    <TouchableRipple borderless style={[styles.card, theme.custom.shadows.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: item.tone }]}>
            <MaterialCommunityIcons name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={22} color={theme.custom.colors.primary} />
          </View>
          <View style={styles.headerText}>
            <View style={styles.senderRow}>
              <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '800' }}>{item.sender.name}</Text>
              {role.verified ? (
                <View style={[styles.verifyBadge, { backgroundColor: role.color }]}>
                  <MaterialCommunityIcons name={role.icon} size={12} color="#FFFFFF" />
                </View>
              ) : null}
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>{role.label}</Text>
            </View>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{item.time} - {item.meta}</Text>
          </View>
          {item.pinned ? <MaterialCommunityIcons name="pin-outline" size={20} color={theme.colors.primary} /> : null}
        </View>
        <View style={[styles.reason, { backgroundColor: theme.colors.surfaceVariant }]}>
          <MaterialCommunityIcons name="information-outline" size={14} color={theme.colors.primary} />
          <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '800' }}>{item.reason}</Text>
        </View>
        <Text variant="titleMedium" style={styles.title}>{item.title}</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{item.body}</Text>
      </View>
    </TouchableRipple>
  );
};

const roleMeta = (role: FeedSenderRole) => {
  switch (role) {
    case 'teacher-admin':
      return { label: 'Teacher admin', color: '#2E7D62', icon: 'check-decagram' as const, verified: true };
    case 'system-admin':
      return { label: 'System admin', color: '#D9822B', icon: 'shield-check' as const, verified: true };
    case 'ai':
      return { label: 'AI assistant', color: '#1A2B3B', icon: 'auto-fix' as const, verified: true };
    default:
      return { label: 'Student', color: '#6B7785', icon: 'account-circle' as const, verified: false };
  }
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  inner: {
    gap: 12,
    padding: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  senderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  verifyBadge: {
    alignItems: 'center',
    borderRadius: 999,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 14,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  reason: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  title: {
    fontWeight: '800',
  },
});
