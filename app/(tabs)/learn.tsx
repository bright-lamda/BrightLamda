import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProgressBar, SegmentedButtons, Text, TouchableRipple, useTheme } from 'react-native-paper';
import {
  bfaHorizonsPosts,
  continueLearning,
  noteGroups,
  scienceBlogPosts,
} from '@/constants/learningContent';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AppTheme } from '@/theme';

type LearnTab = 'notes' | 'physics-blog' | 'bfa-horizons';

export default function LearnScreen() {
  const theme = useTheme<AppTheme>();
  const [activeTab, setActiveTab] = useState<LearnTab>('notes');

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Learn</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Continue studying, then choose one learning area to explore.
        </Text>
      </View>

      <View style={[styles.continueCard, { backgroundColor: theme.colors.surface }]}>
        <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '800' }}>Continue Learning</Text>
        <Text variant="titleLarge" style={styles.title}>{continueLearning.title}</Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{continueLearning.detail}</Text>
        <ProgressBar progress={continueLearning.progress / 100} color={theme.colors.primary} style={styles.progress} />
        <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>{continueLearning.progress}% complete</Text>
      </View>

      <SegmentedButtons
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as LearnTab)}
        buttons={[
          { value: 'notes', label: 'Notes', icon: 'file-pdf-box' },
          { value: 'physics-blog', label: 'Physics Blog', icon: 'atom' },
          { value: 'bfa-horizons', label: 'BFA Horizons', icon: 'telescope' },
        ]}
        style={styles.tabs}
      />

      {activeTab === 'notes' ? <NotesTab /> : null}
      {activeTab === 'physics-blog' ? <PhysicsBlogTab /> : null}
      {activeTab === 'bfa-horizons' ? <BfaHorizonsTab /> : null}
    </Screen>
  );
}

const NotesTab = () => {
  const theme = useTheme<AppTheme>();

  return (
    <View style={styles.tabContent}>
      <SectionHeader title="Notes" />
      {noteGroups.map((group) => (
        <View key={group.level} style={[styles.noteGroup, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={styles.title}>{group.level}</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{group.description}</Text>
          <View style={styles.pdfList}>
            {group.notes.map((note) => (
              <TouchableRipple key={note.title} borderless style={[styles.pdfCard, { borderColor: theme.colors.outline }]}>
                <View style={styles.pdfInner}>
                  <View style={[styles.pdfIcon, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <MaterialCommunityIcons name="file-pdf-box" size={24} color={theme.colors.primary} />
                  </View>
                  <View style={styles.pdfCopy}>
                    <Text variant="titleSmall" style={styles.title}>{note.title}</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{note.size} - {note.updated}</Text>
                  </View>
                  <MaterialCommunityIcons name="download-outline" size={22} color={theme.colors.primary} />
                </View>
              </TouchableRipple>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const PhysicsBlogTab = () => {
  const theme = useTheme<AppTheme>();

  return (
    <View style={styles.tabContent}>
      <SectionHeader title="Physics Blog" />
      {scienceBlogPosts.map((post) => (
        <View key={post.title} style={[styles.postCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '800' }}>{post.visibleInForumAs}</Text>
          <Text variant="titleMedium" style={styles.title}>{post.title}</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{post.body}</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Created by {post.author} - {post.role}. If shared to forum, students see {post.visibleInForumAs}.
          </Text>
        </View>
      ))}
    </View>
  );
};

const BfaHorizonsTab = () => {
  const theme = useTheme<AppTheme>();

  return (
    <View style={styles.tabContent}>
      <SectionHeader title="BFA Horizons" />
      {bfaHorizonsPosts.map((post) => (
        <View key={post.title} style={[styles.postCard, { backgroundColor: theme.colors.surface }]}>
          <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '800' }}>{post.visibleInForumAs}</Text>
          <Text variant="titleMedium" style={styles.title}>{post.title}</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{post.body}</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Created by {post.author} - {post.role}. If shared to forum, students see {post.visibleInForumAs}.
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 8,
    marginBottom: 18,
  },
  title: {
    fontWeight: '800',
  },
  continueCard: {
    borderRadius: 22,
    gap: 10,
    marginBottom: 24,
    padding: 20,
  },
  progress: {
    borderRadius: 999,
    height: 8,
  },
  tabs: {
    marginBottom: 18,
  },
  tabContent: {
    gap: 14,
    paddingBottom: 78,
  },
  noteGroup: {
    borderRadius: 20,
    gap: 10,
    padding: 18,
  },
  pdfList: {
    gap: 10,
  },
  pdfCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pdfInner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  pdfIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  pdfCopy: {
    flex: 1,
    gap: 2,
  },
  postCard: {
    borderRadius: 18,
    gap: 8,
    padding: 18,
  },
});
