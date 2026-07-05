import { Badge } from 'react-native-paper';

interface NotificationBadgeProps {
  count: number;
}

export const NotificationBadge = ({ count }: NotificationBadgeProps) => (count > 0 ? <Badge>{count > 99 ? '99+' : count}</Badge> : null);
