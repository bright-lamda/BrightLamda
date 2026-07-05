import { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { AppTextInput } from './AppTextInput';

type PasswordInputProps = React.ComponentProps<typeof AppTextInput>;

export const PasswordInput = (props: PasswordInputProps) => {
  const [secure, setSecure] = useState(true);

  return (
    <AppTextInput
      secureTextEntry={secure}
      right={<TextInput.Icon icon={secure ? 'eye-outline' : 'eye-off-outline'} onPress={() => setSecure((value) => !value)} />}
      {...props}
    />
  );
};
