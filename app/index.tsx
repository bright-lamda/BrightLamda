import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/hooks/useAuth';
import { AppTheme } from '@/theme';

export default function SplashScreen() {
  const auth = useAuth();
  const theme = useTheme<AppTheme>();

  useEffect(() => {
    if (auth.isBootstrapping) return;

    const timer = setTimeout(() => {
      if (!auth.isAuthenticated) {
        router.replace('/(auth)/onboarding');
        return;
      }

      router.replace('/(tabs)/home');
    }, 650);

    return () => clearTimeout(timer);
  }, [auth.isAuthenticated, auth.isBootstrapping]);

  return (
    <Screen padded={false}>
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.brand}>
          <Image source={require('../logo.png')} style={styles.logo} resizeMode="contain" />
          <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
            Bright Lamda
          </Text>
        </Animated.View>
        <ActivityIndicator />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 28,
  },
  brand: {
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    height: 120,
    width: 180,
  },
});
