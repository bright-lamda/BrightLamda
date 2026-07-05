import { LearningCategoryId } from '@/types/auth';

export const paperCategories: Array<{
  id: LearningCategoryId;
  title: string;
  subtitle: string;
  exams?: string[];
}> = [
  {
    id: 'ordinary-physics',
    title: 'Ordinary Level',
    subtitle: 'GCE O Level Physics papers and practicals',
  },
  {
    id: 'advanced-physics',
    title: 'Advanced Level',
    subtitle: 'GCE A Level Physics theory and practical papers',
  },
  {
    id: 'competitive-physics',
    title: 'Competitive Entrance Examinations',
    subtitle: 'Prepa and concours Physics preparation papers',
    exams: ['FET', 'Polytechnic', 'ENS', 'ENSET'],
  },
];

export const paperFilters = {
  years: ['2026', '2025', '2024', '2023', '2022'],
  sessions: ['June', 'Mock', 'Entrance', 'Practice'],
  difficulties: ['Core', 'Standard', 'Advanced', 'Competitive'],
  topics: ['Mechanics', 'Electricity', 'Waves', 'Thermal Physics', 'Practical Physics'],
};

export const samplePapers = [
  { id: 'p1', title: 'Physics Paper 1', year: '2025', session: 'June', difficulty: 'Standard', topic: 'Mechanics' },
  { id: 'p2', title: 'Physics Practical Paper', year: '2024', session: 'June', difficulty: 'Advanced', topic: 'Practical Physics' },
  { id: 'p3', title: 'Entrance Physics Set A', year: '2026', session: 'Entrance', difficulty: 'Competitive', topic: 'Electricity' },
];
