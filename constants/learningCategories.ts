import { LearningCategory } from '@/types/auth';

export const learningCategories: LearningCategory[] = [
  {
    id: 'ordinary-physics',
    title: 'Ordinary Level Physics',
    shortTitle: 'O Level Physics',
    description: 'Cameroon Ordinary Level Physics foundations, practicals, and exam preparation.',
  },
  {
    id: 'advanced-physics',
    title: 'Advanced Level Physics',
    shortTitle: 'A Level Physics',
    description: 'Advanced mechanics, fields, waves, matter, and higher-order problem solving.',
  },
  {
    id: 'competitive-physics',
    title: 'Competitive Entrance Examination Physics',
    shortTitle: 'Concours Physics',
    description: 'Physics preparation for FET, Polytechnic, ENS, ENSET, and other entrance examinations.',
  },
];

export const getCategoryLabel = (id?: string) =>
  learningCategories.find((category) => category.id === id)?.shortTitle ?? learningCategories[0].shortTitle;
