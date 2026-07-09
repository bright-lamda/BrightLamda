import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Chip, Divider, List, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { AdminActionCard } from '@/components/admin/AdminActionCard';
import { AdminResourceForms } from '@/components/admin/AdminResourceForms';
import { AppButton } from '@/components/ui/AppButton';
import { AppTextInput } from '@/components/ui/AppTextInput';
import { CustomAppBar } from '@/components/ui/CustomAppBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { adminAccounts, studentCapabilities, systemAdminActions, teacherAdminActions } from '@/constants/admin';
import { adminService } from '@/services/adminService';
import { AdminRole } from '@/types/admin';
import { AppTheme } from '@/theme';

const formatSubmittedAt = (value?: string) => {
  if (!value) return 'Pending review';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
};

export default function SystemAdminScreen() {
  const theme = useTheme<AppTheme>();
  const queryClient = useQueryClient();
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('teacher-admin');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminWhatsapp, setNewAdminWhatsapp] = useState('');
  const [rejectionReason, setRejectionReason] = useState('Needs revision before publishing.');
  const [statusMessage, setStatusMessage] = useState('');

  const pendingContentQuery = useQuery({
    queryKey: ['admin', 'pending-content'],
    queryFn: adminService.listPendingContent,
  });

  const approveMutation = useMutation({
    mutationFn: adminService.approveContent,
    onSuccess: async () => {
      setStatusMessage('Content approved.');
      await queryClient.invalidateQueries({ queryKey: ['admin', 'pending-content'] });
    },
    onError: (error) => setStatusMessage(error instanceof Error ? error.message : 'Approval failed.'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminService.rejectContent(id, reason),
    onSuccess: async () => {
      setStatusMessage('Content rejected.');
      await queryClient.invalidateQueries({ queryKey: ['admin', 'pending-content'] });
    },
    onError: (error) => setStatusMessage(error instanceof Error ? error.message : 'Rejection failed.'),
  });

  const inviteMutation = useMutation({
    mutationFn: adminService.inviteAdmin,
    onSuccess: () => {
      setStatusMessage('Admin invitation sent.');
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminWhatsapp('');
    },
    onError: (error) => setStatusMessage(error instanceof Error ? error.message : 'Admin invitation failed.'),
  });

  const isInvitingDisabled = useMemo(
    () => !newAdminName.trim() || !newAdminEmail.trim() || !newAdminWhatsapp.trim() || inviteMutation.isPending,
    [inviteMutation.isPending, newAdminEmail, newAdminName, newAdminWhatsapp],
  );

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

        {statusMessage ? (
          <View style={[styles.status, { backgroundColor: theme.colors.surface }]}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>{statusMessage}</Text>
          </View>
        ) : null}

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
          <AppTextInput label="Default rejection reason" value={rejectionReason} onChangeText={setRejectionReason} multiline />
          {pendingContentQuery.isLoading ? <Text>Loading pending content...</Text> : null}
          {pendingContentQuery.isError ? <Text style={{ color: theme.colors.error }}>Unable to load pending content.</Text> : null}
          {pendingContentQuery.data?.length === 0 ? <EmptyState title="No pending content" description="Teacher submissions will appear here for validation." /> : null}
          {pendingContentQuery.data?.map((item, index) => (
            <View key={item.id}>
              <List.Item
                title={item.title}
                description={`${item.author_name ?? 'Teacher Admin'} - ${item.type} - ${formatSubmittedAt(item.created_at)}`}
                left={(props) => <List.Icon {...props} icon="file-clock-outline" />}
                right={() => (
                  <View style={styles.validationActions}>
                    <Button compact disabled={rejectMutation.isPending} onPress={() => rejectMutation.mutate({ id: item.id, reason: rejectionReason })}>Reject</Button>
                    <Button compact mode="contained" disabled={approveMutation.isPending} onPress={() => approveMutation.mutate(item.id)}>Approve</Button>
                  </View>
                )}
              />
              {index < (pendingContentQuery.data?.length ?? 0) - 1 ? <Divider /> : null}
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
          <AppTextInput label="Admin full name" value={newAdminName} onChangeText={setNewAdminName} />
          <AppTextInput label="Admin email" autoCapitalize="none" keyboardType="email-address" value={newAdminEmail} onChangeText={setNewAdminEmail} />
          <AppTextInput label="WhatsApp number" keyboardType="phone-pad" value={newAdminWhatsapp} onChangeText={setNewAdminWhatsapp} />
          <AppButton
            icon="account-plus-outline"
            loading={inviteMutation.isPending}
            disabled={isInvitingDisabled}
            onPress={() => inviteMutation.mutate({ fullName: newAdminName, email: newAdminEmail, whatsappNumber: newAdminWhatsapp, role: newAdminRole })}
          >
            Send Admin Invite
          </AppButton>
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
  status: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 14,
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

