import { StyleSheet, View } from 'react-native';
import { Text, Button, ButtonProps, useTheme } from 'react-native-paper';
import { AppTheme } from '@/theme';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: ButtonProps['onPress'];
}

export const SectionHeader = ({ title, actionLabel, onActionPress }: SectionHeaderProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={{ fontWeight: '800', color: theme.colors.onSurface }}>
        {title}
      </Text>
      {actionLabel ? <Button compact onPress={onActionPress}>{actionLabel}</Button> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
