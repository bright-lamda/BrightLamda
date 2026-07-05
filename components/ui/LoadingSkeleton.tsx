import { DimensionValue, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '@/theme';

interface LoadingSkeletonProps {
  height?: number;
  width?: DimensionValue;
}

export const LoadingSkeleton = ({ height = 18, width = '100%' }: LoadingSkeletonProps) => {
  const theme = useTheme<AppTheme>();
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { height, width, backgroundColor: theme.colors.surfaceVariant },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 8,
  },
});
