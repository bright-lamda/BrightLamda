import { createContext, PropsWithChildren, useMemo } from 'react';

interface FutureContentState {
  modules: string[];
  isModuleEnabled: (module: string) => boolean;
}

export const FutureContentContext = createContext<FutureContentState | null>(null);

export const FutureContentProvider = ({ children }: PropsWithChildren) => {
  const modules = ['notes', 'ai', 'quiz', 'forum', 'downloads'];

  const value = useMemo(
    () => ({
      modules,
      isModuleEnabled: () => false,
    }),
    [],
  );

  return <FutureContentContext.Provider value={value}>{children}</FutureContentContext.Provider>;
};
