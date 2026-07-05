import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, useTheme } from 'react-native-paper';
import { notifications } from '@/constants/notifications';
import { CustomAppBar } from '@/components/ui/CustomAppBar';
import { Screen } from '@/components/ui/Screen';
import { AppTheme } from '@/theme';

export default function NotificationsScreen() {
  const theme = useTheme<AppTheme>();

  return (
    <>
      <CustomAppBar title="Notifications" onBack={() => router.back()} />
      <Screen scroll>
        <View style={styles.list}>
          {notifications.map((item) => (
            <View key={item.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <View style={[styles.icon, { backgroundColor: item.unread ? theme.custom.colors.accentSoft : theme.colors.surfaceVariant }]}>
                <MaterialCommunityIcons name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={22} color={theme.colors.primary} />
              </View>
              <View style={styles.copy}>
                <View style={styles.row}>
                  <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '800' }}>{item.category}</Text>
                  {item.unread ? <View style={[styles.dot, { backgroundColor: theme.custom.colors.accent }]} /> : null}
                </View>
                <Text variant="titleSmall" style={styles.title}>{item.title}</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{item.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
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
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dot: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  title: {
    fontWeight: '800',
  },
});
