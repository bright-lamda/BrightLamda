import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTheme } from '@/theme';

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
}

export const Screen = ({ children, scroll = false, padded = true, style }: ScreenProps) => {
  const theme = useTheme<AppTheme>();
  const contentStyle = [styles.content, padded && { padding: theme.custom.spacing.xl }, style];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      {scroll ? (
        <ScrollView contentContainerStyle={contentStyle} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={contentStyle}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
