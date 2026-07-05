import { MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper';
import { colors, radius, shadows, spacing, typography } from './tokens';

const fonts = configureFonts({
  config: {
    fontFamily: typography.fontFamily,
  },
});

export const lightTheme = {
  ...MD3LightTheme,
  roundness: radius.md,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.accent,
    background: colors.surfaceAlt,
    surface: colors.surface,
    surfaceVariant: '#EEF3F7',
    outline: colors.line,
    onPrimary: colors.secondary,
    onSurface: colors.ink,
    onSurfaceVariant: colors.muted,
    error: colors.danger,
  },
  custom: {
    colors,
    spacing,
    radius,
    shadows,
    typography,
    mode: 'light' as const,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  roundness: radius.md,
  fonts,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.accent,
    secondary: colors.accent,
    background: '#0B1118',
    surface: colors.darkSurface,
    surfaceVariant: colors.darkSurfaceAlt,
    outline: colors.darkLine,
    onPrimary: colors.primary,
    onSurface: '#F5F8FB',
    onSurfaceVariant: '#A9B6C4',
    error: '#FFB4AB',
  },
  custom: {
    colors,
    spacing,
    radius,
    shadows,
    typography,
    mode: 'dark' as const,
  },
};

export type AppTheme = typeof lightTheme;
