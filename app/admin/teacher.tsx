import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Text, useTheme } from 'react-native-paper';
import { AdminActionCard } from '@/components/admin/AdminActionCard';
import { AdminResourceForms } from '@/components/admin/AdminResourceForms';
import { CustomAppBar } from '@/components/ui/CustomAppBar';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { studentCapabilities, teacherAdminActions } from '@/constants/admin';
import { AppTheme } from '@/theme';

export default function TeacherAdminScreen() {
  const theme = useTheme<AppTheme>();

  return (
    <>
      <CustomAppBar title="Teacher Admin" onBack={() => router.back()} />
      <Screen scroll>
        <View style={[styles.notice, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={styles.title}>Teacher publishing rules</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Teacher admins can prepare notes, papers, answers, quiz questions, Physics Blog posts, BFA Horizons opportunities, and forum communication. Files sent by teachers remain pending until a System Admin validates them.
          </Text>
        </View>

        <SectionHeader title="Student Capabilities" />
        <View style={styles.list}>
          {studentCapabilities.map((action) => (
            <AdminActionCard key={action.title} action={action} />
          ))}
        </View>

        <SectionHeader title="Teacher Admin Tools" />
        <View style={styles.list}>
          {teacherAdminActions.map((action) => (
            <AdminActionCard key={action.title} action={action} />
          ))}
        </View>

        <SectionHeader title="Create Content" />
        <AdminResourceForms />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  notice: {
    borderRadius: 20,
    gap: 8,
    marginBottom: 20,
    padding: 18,
  },
  title: {
    fontWeight: '800',
  },
  list: {
    gap: 12,
    marginBottom: 22,
    marginTop: 12,
  },
});
