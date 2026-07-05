import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Chip, Divider, List, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { AdminActionCard } from '@/components/admin/AdminActionCard';
import { AdminResourceForms } from '@/components/admin/AdminResourceForms';
import { AppButton } from '@/components/ui/AppButton';
import { AppTextInput } from '@/components/ui/AppTextInput';
import { CustomAppBar } from '@/components/ui/CustomAppBar';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { adminAccounts, pendingTeacherContent, studentCapabilities, systemAdminActions, teacherAdminActions } from '@/constants/admin';
import { AdminRole } from '@/types/admin';
import { AppTheme } from '@/theme';

export default function SystemAdminScreen() {
  const theme = useTheme<AppTheme>();
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('teacher-admin');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminContact, setNewAdminContact] = useState('');

  return (
    <>
      <CustomAppBar title="System Admin" onBack={() => router.back()} />
      <Screen scroll>
        <View style={[styles.notice, { backgroundColor: theme.custom.colors.primary }]}>
          <Text variant="titleMedium" style={styles.noticeTitle}>Full platform control</Text>
          <Text variant="bodyMedium" style={styles.noticeText}>
            System admins can do everything available to students and teacher admins, validate teacher content, and create teacher or system admin accounts.
          </Text>
        </View>

        <SectionHeader title="Student Capabilities" />
        <View style={styles.list}>
          {studentCapabilities.map((action) => (
            <AdminActionCard key={action.title} action={action} />
          ))}
        </View>

        <SectionHeader title="Teacher Admin Capabilities" />
        <View style={styles.list}>
          {teacherAdminActions.map((action) => (
            <AdminActionCard key={action.title} action={action} />
          ))}
        </View>

        <SectionHeader title="System Admin Tools" />
        <View style={styles.list}>
          {systemAdminActions.map((action) => (
            <AdminActionCard key={action.title} action={action} />
          ))}
        </View>

        <SectionHeader title="Validate Teacher Content" />
        <View style={[styles.panel, { backgroundColor: theme.colors.surface }]}>
          {pendingTeacherContent.map((item, index) => (
            <View key={item.id}>
              <List.Item
                title={item.title}
                description={`${item.teacherName} - ${item.type} - ${item.submittedAt}`}
                left={(props) => <List.Icon {...props} icon="file-clock-outline" />}
                right={() => (
                  <View style={styles.validationActions}>
                    <Button compact>Reject</Button>
                    <Button compact mode="contained">Approve</Button>
                  </View>
                )}
              />
              {index < pendingTeacherContent.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </View>

        <SectionHeader title="Add Admin Account" />
        <View style={[styles.panel, { backgroundColor: theme.colors.surface }]}>
          <SegmentedButtons
            value={newAdminRole}
            onValueChange={(value) => setNewAdminRole(value as AdminRole)}
            buttons={[
              { value: 'teacher-admin', label: 'Teacher Admin' },
              { value: 'system-admin', label: 'System Admin' },
            ]}
          />
          <AppTextInput label="Admin name" value={newAdminName} onChangeText={setNewAdminName} />
          <AppTextInput label="Phone or email" value={newAdminContact} onChangeText={setNewAdminContact} />
          <AppButton icon="account-plus-outline">Create Admin</AppButton>
        </View>

        <SectionHeader title="Existing Admins" />
        <View style={styles.adminChips}>
          {adminAccounts.map((admin) => (
            <Chip key={admin.id} icon={admin.role === 'system-admin' ? 'shield-crown-outline' : 'account-tie-outline'}>
              {admin.name}
            </Chip>
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
  noticeTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  noticeText: {
    color: '#E7EDF3',
  },
  list: {
    gap: 12,
    marginBottom: 22,
    marginTop: 12,
  },
  panel: {
    borderRadius: 20,
    gap: 12,
    marginBottom: 22,
    marginTop: 12,
    overflow: 'hidden',
    padding: 12,
  },
  validationActions: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  adminChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 22,
    marginTop: 12,
  },
});
