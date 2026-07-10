import { AdminLoginScreen } from '@/components/admin/AdminLoginScreen';

export default function SystemAdminLoginPage() {
  return (
    <AdminLoginScreen
      expectedRole="system_admin"
      title="System Admin Login"
      subtitle="Access full platform controls, teacher validation, admin invitations, and production operations."
      destination="/admin/system"
    />
  );
}
