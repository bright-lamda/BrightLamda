import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import { Subject } from '@/types/user';
import { AppTheme } from '@/theme';

interface SubjectCardProps {
  subject: Subject;
  selected: boolean;
  onPress: () => void;
}

export const SubjectCard = ({ subject, selected, onPress }: SubjectCardProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <TouchableRipple
      onPress={onPress}
      borderless
      style={[
        styles.card,
        theme.custom.shadows.card,
        {
          backgroundColor: selected ? theme.custom.colors.primary : theme.colors.surface,
          borderColor: selected ? theme.custom.colors.accent : theme.colors.outline,
        },
      ]}
    >
      <View style={styles.inner}>
        <View style={[styles.icon, { backgroundColor: selected ? theme.custom.colors.accent : theme.colors.surfaceVariant }]}>
          <MaterialCommunityIcons name={subject.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={24} color={theme.custom.colors.primary} />
        </View>
        <View style={styles.copy}>
          <Text variant="titleSmall" style={{ color: selected ? theme.colors.onPrimary : theme.colors.onSurface, fontWeight: '800' }}>
            {subject.name}
          </Text>
          <Text variant="bodySmall" style={{ color: selected ? '#E7EDF3' : theme.colors.onSurfaceVariant }}>
            {subject.description}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={selected ? 'check-circle' : 'circle-outline'}
          size={24}
          color={selected ? theme.custom.colors.accent : theme.colors.outline}
        />
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
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
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
});
