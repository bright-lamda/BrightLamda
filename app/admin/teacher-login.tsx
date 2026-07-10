import { AdminLoginScreen } from '@/components/admin/AdminLoginScreen';

export default function TeacherAdminLoginPage() {
  return (
    <AdminLoginScreen
      expectedRole="teacher_admin"
      title="Teacher Admin Login"
      subtitle="Access publishing tools for notes, answers, papers, quizzes, Physics Blog, BFA Horizons, and forum communication."
      destination="/admin/teacher"
    />
  );
}
