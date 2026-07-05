export type FeedItemType =
  | 'announcement'
  | 'school-info'
  | 'discussion'
  | 'forum'
  | 'question'
  | 'quiz'
  | 'competition'
  | 'news'
  | 'resource';

export type FeedSenderRole = 'student' | 'teacher-admin' | 'system-admin' | 'ai';

export interface FeedSender {
  name: string;
  role: FeedSenderRole;
}

export interface FeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  body: string;
  sender: FeedSender;
  reason: string;
  time: string;
  meta: string;
  icon: string;
  tone: string;
  pinned?: boolean;
}

export const homeFeed: FeedItem[] = [
  {
    id: 'quiz-weekly',
    type: 'quiz',
    title: 'Weekly Physics Challenge opens Friday',
    body: 'This week focuses on measurements, vectors, and Newtonian mechanics with instant ranking after submission.',
    sender: { name: 'Bright AI', role: 'ai' },
    reason: 'Weekly quiz announcement',
    time: 'Today',
    meta: 'Weekly quiz',
    icon: 'timer-outline',
    tone: '#FFE1A6',
    pinned: true,
  },
  {
    id: 'teacher-announcement',
    type: 'announcement',
    title: 'Live revision clinic: electricity practicals',
    body: 'Mr. Tabe will review circuit diagrams, meter readings, and common GCE practical mistakes.',
    sender: { name: 'Mr. Tabe', role: 'teacher-admin' },
    reason: 'Teacher announcement',
    time: '2h ago',
    meta: 'Ordinary Level Physics',
    icon: 'bullhorn-outline',
    tone: '#D4A3FF',
  },
  {
    id: 'trending-question',
    type: 'question',
    title: 'Why does terminal velocity become constant?',
    body: 'Students are comparing drag force, weight, and resultant force in the forum discussion.',
    sender: { name: 'Nora F.', role: 'student' },
    reason: 'Trending student question',
    time: '4h ago',
    meta: '42 responses',
    icon: 'help-circle-outline',
    tone: '#B7F0D1',
  },
  {
    id: 'competition',
    type: 'competition',
    title: 'FET entrance preparation set released',
    body: 'A curated Physics problem set is now featured for competitive entrance examination candidates.',
    sender: { name: 'Bright Lamda System', role: 'system-admin' },
    reason: 'Competition announcement',
    time: 'Yesterday',
    meta: 'FET - Polytechnic - ENS',
    icon: 'trophy-outline',
    tone: '#C5CEFF',
  },
  {
    id: 'resource',
    type: 'resource',
    title: 'Featured resource: Graphs in practical Physics',
    body: 'A concise guide on gradients, intercepts, units, and error control for practical paper questions.',
    sender: { name: 'Dr. Mbah', role: 'teacher-admin' },
    reason: 'Featured resource',
    time: 'Yesterday',
    meta: 'Practical Physics',
    icon: 'file-star-outline',
    tone: '#9FD7FF',
  },
  {
    id: 'news',
    type: 'news',
    title: 'Education news: science fair registration',
    body: 'Regional science fair registration is open for students presenting experiments and demonstrations.',
    sender: { name: 'System Admin', role: 'system-admin' },
    reason: 'Educational news',
    time: 'Mon',
    meta: 'Cameroon schools',
    icon: 'newspaper-variant-outline',
    tone: '#FFC0D0',
  },
];
