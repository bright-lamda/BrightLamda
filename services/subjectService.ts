import { subjects } from '@/constants/subjects';
import { StudentLevel } from '@/types/auth';

export const subjectService = {
  listSubjects: async (level?: StudentLevel) =>
    subjects.filter((subject) => subject.level === 'both' || !level || subject.level === level),
};
