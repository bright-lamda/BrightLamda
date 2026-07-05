import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import { AppTheme } from '@/theme';

interface LibraryCardProps {
  title: string;
  detail: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  count?: string;
}

export const LibraryCard = ({ title, detail, icon, count }: LibraryCardProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <TouchableRipple borderless style={[styles.card, theme.custom.shadows.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.inner}>
        <View style={[styles.icon, { backgroundColor: theme.colors.surfaceVariant }]}>
          <MaterialCommunityIcons name={icon} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.copy}>
          <Text variant="titleSmall" style={styles.title}>{title}</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{detail}</Text>
        </View>
        {count ? <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '800' }}>{count}</Text> : null}
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  inner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontWeight: '800',
  },
});
