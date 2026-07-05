import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useReducer } from 'react';
import { router } from 'expo-router';
import { authService } from '@/services/authService';
import { LoginCredentials, RegisterPayload, AuthSession } from '@/types/auth';
import { StudentProfile, Subject } from '@/types/user';
import { storage } from '@/utils/storage';
import { setAuthToken } from '@/api/client';

const AUTH_KEY = 'bright-lamda.auth';

interface AuthState {
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  session: AuthSession | null;
  user: StudentProfile | null;
}

interface PersistedAuth {
  session: AuthSession;
  user: StudentProfile;
}

type AuthAction =
  | { type: 'hydrate'; payload: PersistedAuth | null }
  | { type: 'authenticated'; payload: PersistedAuth }
  | { type: 'updateUser'; payload: StudentProfile }
  | { type: 'logout' };

interface AuthContextValue extends AuthState {
  login: (payload: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  completeProfile: (payload: Partial<StudentProfile>) => Promise<void>;
  selectSubjects: (subjects: Subject[]) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'hydrate':
      return {
        isBootstrapping: false,
        isAuthenticated: Boolean(action.payload),
        session: action.payload?.session ?? null,
        user: action.payload?.user ?? null,
      };
    case 'authenticated':
      return {
        isBootstrapping: false,
        isAuthenticated: true,
        session: action.payload.session,
        user: action.payload.user,
      };
    case 'updateUser':
      return { ...state, user: action.payload };
    case 'logout':
      return { isBootstrapping: false, isAuthenticated: false, session: null, user: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, {
    isBootstrapping: true,
    isAuthenticated: false,
    session: null,
    user: null,
  });

  useEffect(() => {
    void storage.get<PersistedAuth>(AUTH_KEY).then((payload) => {
      setAuthToken(payload?.session.accessToken);
      dispatch({ type: 'hydrate', payload });
    });
  }, []);

  const persistAuth = useCallback(async (payload: PersistedAuth) => {
    setAuthToken(payload.session.accessToken);
    await storage.set(AUTH_KEY, payload);
    dispatch({ type: 'authenticated', payload });
  }, []);

  const updateUser = useCallback(
    async (user: StudentProfile) => {
      if (!state.session) return;
      const payload = { session: state.session, user };
      await storage.set(AUTH_KEY, payload);
      dispatch({ type: 'updateUser', payload: user });
    },
    [state.session],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login: async (payload) => {
        const result = await authService.login(payload);
        await persistAuth(result);
      },
      register: async (payload) => {
        const result = await authService.register(payload);
        await persistAuth(result);
      },
      completeProfile: async (payload) => {
        if (!state.user) return;
        await updateUser({ ...state.user, ...payload, profileCompleted: true });
      },
      selectSubjects: async (selectedSubjects) => {
        if (!state.user) return;
        await updateUser({ ...state.user, subjects: selectedSubjects });
      },
      logout: async () => {
        setAuthToken(undefined);
        await storage.remove(AUTH_KEY);
        dispatch({ type: 'logout' });
        router.replace('/(auth)/welcome');
      },
    }),
    [persistAuth, state, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
