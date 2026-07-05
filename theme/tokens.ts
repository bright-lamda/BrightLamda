import { Platform } from 'react-native';

export const colors = {
  primary: '#1A2B3B',
  primarySoft: '#263D52',
  secondary: '#FFFFFF',
  accent: '#D4A3FF',
  accentSoft: '#F3E4FF',
  success: '#2E7D62',
  warning: '#B7791F',
  danger: '#B94A48',
  info: '#4169A8',
  ink: '#10202F',
  muted: '#6B7785',
  line: '#E7ECF1',
  surface: '#FFFFFF',
  surfaceAlt: '#F7F9FC',
  darkSurface: '#101922',
  darkSurfaceAlt: '#172332',
  darkLine: '#2A3B4C',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  display: { fontSize: 34, lineHeight: 42, fontWeight: '700' as const },
  title: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  subtitle: { fontSize: 18, lineHeight: 26, fontWeight: '700' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '700' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
} as const;

export const shadows = {
  card: {
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  floating: {
    shadowColor: colors.primary,
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
} as const;
