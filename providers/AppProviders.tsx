import { PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/AuthContext';
import { FutureContentProvider } from '@/context/FutureContentContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { QueryProvider } from './QueryProvider';

export const AppProviders = ({ children }: PropsWithChildren) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <QueryProvider>
        <ThemeProvider>
          <SettingsProvider>
            <FutureContentProvider>
              <AuthProvider>{children}</AuthProvider>
            </FutureContentProvider>
          </SettingsProvider>
        </ThemeProvider>
      </QueryProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);
