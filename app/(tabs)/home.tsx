import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { IconButton, Text, TextInput, TouchableRipple, useTheme } from 'react-native-paper';
import { FeedItem, homeFeed } from '@/constants/feed';
import { getCategoryLabel } from '@/constants/learningCategories';
import { FeedCard } from '@/components/feed/FeedCard';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { NotificationBadge } from '@/components/ui/NotificationBadge';
import { useAuth } from '@/hooks/useAuth';
import { AppTheme } from '@/theme';

export default function HomeScreen() {
  const { user } = useAuth();
  const theme = useTheme<AppTheme>();
  const name = user?.fullName ?? 'Student';
  const category = getCategoryLabel(user?.currentCategory);
  const [message, setMessage] = useState('');
  const [studentPosts, setStudentPosts] = useState<FeedItem[]>([]);
  const feed = useMemo(() => [...studentPosts, ...homeFeed], [studentPosts]);

  const publishMessage = () => {
    const trimmed = message.trim();

    if (!trimmed) return;

    setStudentPosts((current) => [
      {
        id: `student-${Date.now()}`,
        type: 'forum',
        title: 'Student message',
        body: trimmed,
        sender: { name, role: 'student' },
        reason: 'Student forum post',
        time: 'Just now',
        meta: category,
        icon: 'account-voice',
        tone: '#E7ECF1',
      },
      ...current,
    ]);
    setMessage('');
  };

  return (
    <Screen scroll>
      <View style={styles.topBar}>
        <View>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Good day</Text>
          <Text variant="headlineSmall" style={styles.heading}>{name}</Text>
          <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '800' }}>{category}</Text>
        </View>
        <View style={styles.topActions}>
          <View>
            <IconButton icon="bell-outline" mode="contained-tonal" onPress={() => router.push('/notifications')} />
            <View style={styles.badge}>
              <NotificationBadge count={3} />
            </View>
          </View>
          <TouchableRipple borderless onPress={() => router.push('/profile')} style={styles.avatarButton}>
            <UserAvatar name={name} />
          </TouchableRipple>
        </View>
      </View>

      <View style={[styles.hero, { backgroundColor: theme.custom.colors.primary }]}>
        <Text variant="labelLarge" style={styles.heroMeta}>Featured today</Text>
        <Text variant="titleLarge" style={styles.heroTitle}>Physics community briefing</Text>
        <Text variant="bodyMedium" style={styles.heroText}>Teacher updates, trending questions, competitions, and resources curated for your current category.</Text>
      </View>

      <SectionHeader title="Activity Feed" />
      <View style={[styles.composer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.composerHeader}>
          <UserAvatar name={name} size={36} />
          <View style={styles.composerCopy}>
            <Text variant="labelLarge" style={{ fontWeight: '800' }}>Write to the community</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Ask a question, share a resource, or start a Physics discussion.</Text>
          </View>
        </View>
        <TextInput
          mode="outlined"
          value={message}
          onChangeText={setMessage}
          placeholder="What do you want to discuss?"
          multiline
          outlineColor={theme.colors.outline}
          activeOutlineColor={theme.colors.primary}
          style={{ backgroundColor: theme.colors.surface }}
        />
        <View style={styles.composerActions}>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Posts appear as student messages.</Text>
          <IconButton icon="send" mode="contained" disabled={!message.trim()} onPress={publishMessage} />
        </View>
      </View>
      <View style={styles.feed}>
        {feed.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  heading: {
    fontWeight: '800',
  },
  topActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  badge: {
    position: 'absolute',
    right: 7,
    top: 7,
  },
  avatarButton: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  hero: {
    borderRadius: 24,
    gap: 10,
    marginBottom: 18,
    padding: 22,
  },
  heroMeta: {
    color: '#D4A3FF',
    fontWeight: '800',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  heroText: {
    color: '#E7EDF3',
  },
  feed: {
    gap: 14,
    marginTop: 12,
    paddingBottom: 78,
  },
  composer: {
    borderRadius: 18,
    gap: 12,
    marginTop: 12,
    padding: 16,
  },
  composerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  composerCopy: {
    flex: 1,
  },
  composerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
