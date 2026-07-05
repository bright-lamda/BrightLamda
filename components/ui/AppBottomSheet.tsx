import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Modal, useTheme } from 'react-native-paper';
import { AppTheme } from '@/theme';

interface AppBottomSheetProps extends PropsWithChildren {
  visible: boolean;
  onDismiss: () => void;
}

export const AppBottomSheet = ({ visible, onDismiss, children }: AppBottomSheetProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.handle, { backgroundColor: theme.colors.outline }]} />
          {children}
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  handle: {
    alignSelf: 'center',
    borderRadius: 999,
    height: 4,
    marginBottom: 18,
    width: 44,
  },
});
