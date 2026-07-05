import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import { AppTheme } from '@/theme';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tone?: string;
  onPress?: () => void;
}

export const FeatureCard = ({ title, description, icon, tone, onPress }: FeatureCardProps) => {
  const theme = useTheme<AppTheme>();
  const accent = tone ?? theme.custom.colors.accent;

  return (
    <TouchableRipple borderless onPress={onPress} style={[styles.card, theme.custom.shadows.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.inner}>
        <View style={[styles.iconWrap, { backgroundColor: accent }]}>
          <MaterialCommunityIcons name={icon} size={23} color={theme.custom.colors.primary} />
        </View>
        <Text variant="titleSmall" style={styles.title}>{title}</Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{description}</Text>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    flexBasis: '48%',
    overflow: 'hidden',
  },
  inner: {
    minHeight: 150,
    padding: 16,
    gap: 10,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 14,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  title: {
    fontWeight: '800',
  },
});
