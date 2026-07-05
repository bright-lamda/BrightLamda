import { Appbar, useTheme } from 'react-native-paper';
import { AppTheme } from '@/theme';

interface CustomAppBarProps {
  title: string;
  onBack?: () => void;
}

export const CustomAppBar = ({ title, onBack }: CustomAppBarProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <Appbar.Header mode="center-aligned" style={{ backgroundColor: theme.colors.background }}>
      {onBack ? <Appbar.BackAction onPress={onBack} /> : null}
      <Appbar.Content title={title} titleStyle={{ fontWeight: '800' }} />
    </Appbar.Header>
  );
};
