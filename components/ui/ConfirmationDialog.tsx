import { Button, Dialog, Portal, Text } from 'react-native-paper';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onDismiss: () => void;
  onConfirm: () => void;
}

export const ConfirmationDialog = ({
  visible,
  title,
  description,
  confirmLabel = 'Confirm',
  onDismiss,
  onConfirm,
}: ConfirmationDialogProps) => (
  <Portal>
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{description}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Cancel</Button>
        <Button onPress={onConfirm}>{confirmLabel}</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);
