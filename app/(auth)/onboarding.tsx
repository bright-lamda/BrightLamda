import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Text, useTheme } from 'react-native-paper';
import { onboardingSlides } from '@/constants/onboarding';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { AppTheme } from '@/theme';

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const theme = useTheme<AppTheme>();
  const slide = onboardingSlides[index];

  const next = () => {
    if (index < onboardingSlides.length - 1) {
      setIndex((value) => value + 1);
      return;
    }

    router.replace('/(auth)/welcome');
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.progressRow}>
          {onboardingSlides.map((item, itemIndex) => (
            <View
              key={item.title}
              style={[
                styles.progress,
                {
                  backgroundColor: itemIndex <= index ? theme.colors.primary : theme.colors.surfaceVariant,
                  flex: itemIndex === index ? 1.8 : 1,
                },
              ]}
            />
          ))}
        </View>
        <Animated.View key={slide.title} entering={FadeInRight.duration(350)} style={styles.slide}>
          <View style={[styles.icon, { backgroundColor: theme.custom.colors.accentSoft }]}>
            <MaterialCommunityIcons name={slide.icon} size={48} color={theme.custom.colors.primary} />
          </View>
          <Text variant="displaySmall" style={styles.title}>{slide.title}</Text>
          <Text variant="bodyLarge" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>{slide.description}</Text>
        </Animated.View>
        <View style={styles.actions}>
          <AppButton variant="ghost" onPress={() => router.replace('/(auth)/welcome')}>
            Skip
          </AppButton>
          <AppButton onPress={next}>{index === onboardingSlides.length - 1 ? 'Get Started' : 'Continue'}</AppButton>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
  },
  progress: {
    borderRadius: 999,
    height: 5,
  },
  slide: {
    gap: 18,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 28,
    height: 112,
    justifyContent: 'center',
    width: 112,
  },
  title: {
    fontWeight: '800',
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
  },
  actions: {
    gap: 12,
  },
});
