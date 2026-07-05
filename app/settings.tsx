import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Divider, List, Switch } from 'react-native-paper';
import { CustomAppBar } from '@/components/ui/CustomAppBar';
import { Screen } from '@/components/ui/Screen';
import { useThemeMode } from '@/hooks/useThemeMode';

export default function SettingsScreen() {
  const theme = useThemeMode();

  return (
    <>
      <CustomAppBar title="Settings" onBack={() => router.back()} />
      <Screen scroll>
        <View style={styles.panel}>
          <List.Item
            title="Dark mode"
            description="Use the Bright Lamda dark theme"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => <Switch value={theme.isDark} onValueChange={(value) => theme.setPreference(value ? 'dark' : 'light')} />}
          />
          <Divider />
          <List.Item title="Language" description="English" left={(props) => <List.Icon {...props} icon="translate" />} />
          <Divider />
          <List.Item title="Notification preferences" description="Announcements, quizzes, forum replies, AI, uploads" left={(props) => <List.Icon {...props} icon="bell-cog-outline" />} />
          <Divider />
          <List.Item title="Privacy" description="Control account privacy and data choices" left={(props) => <List.Icon {...props} icon="shield-lock-outline" />} />
          <Divider />
          <List.Item title="Download preferences" description="Offline resources and network rules" left={(props) => <List.Icon {...props} icon="download-cog-outline" />} />
          <Divider />
          <List.Item title="Account management" description="Email, password, and account security" left={(props) => <List.Icon {...props} icon="account-cog-outline" />} />
          <Divider />
          <List.Item title="About Bright Lamda" description="Version, platform information, and policies" left={(props) => <List.Icon {...props} icon="information-outline" />} />
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  panel: {
    overflow: 'hidden',
  },
});
