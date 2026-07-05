import { createContext } from 'react';
import { StudentProfile } from '@/types/user';

export interface UserStore {
  user: StudentProfile | null;
}

export const UserStoreContext = createContext<UserStore>({ user: null });
