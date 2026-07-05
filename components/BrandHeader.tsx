import { Image, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { BRAND } from '@/constants/brand';
import { AppTheme } from '@/theme';

interface BrandHeaderProps {
  title?: string;
  subtitle?: string;
}

export const BrandHeader = ({ title = BRAND.appName, subtitle = BRAND.tagline }: BrandHeaderProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <View style={styles.container}>
      <Image source={require('../logo.png')} style={styles.logo} resizeMode="contain" />
      <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    height: 92,
    width: 160,
  },
  title: {
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    maxWidth: 290,
    textAlign: 'center',
  },
});
