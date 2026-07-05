import { PropsWithChildren } from 'react';
import { Portal, Modal, useTheme } from 'react-native-paper';
import { AppTheme } from '@/theme';

interface AppModalProps extends PropsWithChildren {
  visible: boolean;
  onDismiss: () => void;
}

export const AppModal = ({ visible, onDismiss, children }: AppModalProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.custom.radius.lg,
          margin: theme.custom.spacing.xl,
          padding: theme.custom.spacing.xl,
        }}
      >
        {children}
      </Modal>
    </Portal>
  );
};
