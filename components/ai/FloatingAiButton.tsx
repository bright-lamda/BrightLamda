import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { AppTheme } from '@/theme';

export const FloatingAiButton = () => {
  const theme = useTheme<AppTheme>();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.05, { duration: 1200 }), withTiming(1, { duration: 1200 })), -1);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.wrap, animatedStyle, theme.custom.shadows.floating]}>
      <TouchableRipple
        borderless
        onPress={() => router.push('/ai-tutor')}
        style={[styles.button, { backgroundColor: theme.custom.colors.primary, borderColor: theme.custom.colors.accent }]}
      >
        <MaterialCommunityIcons name="auto-fix" size={28} color={theme.custom.colors.accent} />
      </TouchableRipple>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    borderRadius: 999,
    bottom: 66,
    position: 'absolute',
    zIndex: 20,
  },
  button: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 2,
    height: 64,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 64,
  },
});
