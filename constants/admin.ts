import { AdminAction, AdminAccount, PendingTeacherContent } from '@/types/admin';

export const teacherAdminActions: AdminAction[] = [
  {
    title: 'Upload Notes',
    description: 'Add PDF notes by specifying the visible resource name.',
    icon: 'file-pdf-box',
  },
  {
    title: 'Upload Papers',
    description: 'Add exam papers in PDF, for example GCE 2025 Physics Paper 1.',
    icon: 'file-document-multiple-outline',
  },
  {
    title: 'Upload Answers',
    description: 'Add answer PDFs for Paper 1, Paper 2, or Paper 3 resources.',
    icon: 'clipboard-check-outline',
  },
  {
    title: 'Set Quiz Questions',
    description: 'Create quiz questions for weekly, topic, or competition practice.',
    icon: 'comment-question-outline',
  },
  {
    title: 'Publish Blog',
    description: 'Send Physics Blog posts with title, image, and content.',
    icon: 'atom',
  },
  {
    title: 'Publish Opportunity',
    description: 'Send BFA Horizons opportunities, scholarships, and academic openings.',
    icon: 'telescope',
  },
  {
    title: 'Forum Communication',
    description: 'Participate freely in student and admin forum discussions.',
    icon: 'forum-outline',
  },
];

export const studentCapabilities: AdminAction[] = [
  {
    title: 'Student App Access',
    description: 'View Home, Learn, Answers, Quiz, Papers, Profile, Notifications, and Bright AI.',
    icon: 'cellphone',
  },
  {
    title: 'Community Feed',
    description: 'Read announcements, trending questions, opportunities, blogs, and forum posts.',
    icon: 'rss',
  },
];

export const systemAdminActions: AdminAction[] = [
  {
    title: 'Validate Teacher Content',
    description: 'Approve or reject every teacher-uploaded file before students can access it.',
    icon: 'shield-check-outline',
  },
  {
    title: 'Add Teacher Admin',
    description: 'Create teacher admin accounts and assign publishing privileges.',
    icon: 'account-tie-outline',
  },
  {
    title: 'Add System Admin',
    description: 'Create another system admin with full platform permissions.',
    icon: 'account-supervisor-circle-outline',
  },
];

export const pendingTeacherContent: PendingTeacherContent[] = [
  {
    id: 'pending-1',
    teacherName: 'Mr. Tabe',
    type: 'notes',
    title: 'GCE 2025 Physics Measurements Notes',
    submittedAt: 'Today',
  },
  {
    id: 'pending-2',
    teacherName: 'Ms. Ngalle',
    type: 'answers',
    title: 'GCE 2024 Physics Paper 2 Answers',
    submittedAt: 'Yesterday',
  },
  {
    id: 'pending-3',
    teacherName: 'Dr. Mbah',
    type: 'papers',
    title: 'FET Entrance Physics Practice Set A',
    submittedAt: 'Mon',
  },
];

export const adminAccounts: AdminAccount[] = [
  {
    id: 'admin-1',
    name: 'Mr. Tabe',
    role: 'teacher-admin',
    contact: '+237 680 111 222',
  },
  {
    id: 'admin-2',
    name: 'Bright Lamda System',
    role: 'system-admin',
    contact: '+237 680 000 000',
  },
];
