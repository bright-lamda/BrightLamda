import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Divider, List, Text, useTheme } from 'react-native-paper';
import { CustomAppBar } from '@/components/ui/CustomAppBar';
import { Screen } from '@/components/ui/Screen';
import { StatCard } from '@/components/ui/StatCard';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { getCategoryLabel } from '@/constants/learningCategories';
import { useAuth } from '@/hooks/useAuth';
import { capitalize } from '@/utils/format';
import { AppTheme } from '@/theme';

export default function ProfileScreen() {
  const auth = useAuth();
  const theme = useTheme<AppTheme>();
  const user = auth.user;
  const name = user?.fullName ?? 'Student';

  return (
    <>
      <CustomAppBar title="Profile" onBack={() => router.back()} />
      <Screen scroll>
        <View style={styles.header}>
          <UserAvatar name={name} size={82} />
          <Text variant="headlineSmall" style={styles.name}>{name}</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {user?.level ? `${capitalize(user.level)} Level` : 'Physics Student'} • {getCategoryLabel(user?.currentCategory)}
          </Text>
        </View>

        <View style={styles.stats}>
          <StatCard label="Study streak" value="7d" icon="fire" />
          <StatCard label="Progress" value="64%" icon="chart-line" />
        </View>

        <View style={[styles.panel, { backgroundColor: theme.colors.surface }]}>
          <List.Item title="Personal information" left={(props) => <List.Icon {...props} icon="account-outline" />} />
          <Divider />
          <List.Item title="Learning statistics" left={(props) => <List.Icon {...props} icon="chart-box-outline" />} />
          <Divider />
          <List.Item title="Achievements" left={(props) => <List.Icon {...props} icon="medal-outline" />} />
          <Divider />
          <List.Item title="Subscription" left={(props) => <List.Icon {...props} icon="credit-card-outline" />} />
          <Divider />
          <List.Item title="Downloads" left={(props) => <List.Icon {...props} icon="download-outline" />} />
          <Divider />
          <List.Item title="Saved resources" left={(props) => <List.Icon {...props} icon="bookmark-multiple-outline" />} />
          <Divider />
          <List.Item title="Notifications" onPress={() => router.push('/notifications')} left={(props) => <List.Icon {...props} icon="bell-outline" />} />
          <Divider />
          <List.Item title="Settings" onPress={() => router.push('/settings')} left={(props) => <List.Icon {...props} icon="cog-outline" />} />
          <Divider />
          <List.Item title="Help & Support" left={(props) => <List.Icon {...props} icon="lifebuoy" />} />
        </View>

        <Button mode="outlined" onPress={auth.logout} style={styles.logout}>Log Out</Button>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  name: {
    fontWeight: '800',
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  panel: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  logout: {
    marginTop: 18,
  },
});
