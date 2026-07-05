import { Avatar } from 'react-native-paper';
import { getInitials } from '@/utils/format';

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
}

export const UserAvatar = ({ name, imageUrl, size = 42 }: UserAvatarProps) =>
  imageUrl ? <Avatar.Image source={{ uri: imageUrl }} size={size} /> : <Avatar.Text label={getInitials(name)} size={size} />;
