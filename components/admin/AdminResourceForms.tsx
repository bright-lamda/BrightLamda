import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { AppButton } from '@/components/ui/AppButton';
import { AppTextInput } from '@/components/ui/AppTextInput';
import { ManagedContentType, PublicationChannel } from '@/types/admin';
import { AppTheme } from '@/theme';

export const AdminResourceForms = () => {
  const theme = useTheme<AppTheme>();
  const [contentType, setContentType] = useState<ManagedContentType>('notes');
  const [resourceName, setResourceName] = useState('');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizAnswer, setQuizAnswer] = useState('');
  const [publicationChannel, setPublicationChannel] = useState<PublicationChannel>('platform-only');
  const [postTitle, setPostTitle] = useState('');
  const [postImage, setPostImage] = useState('');
  const [postContent, setPostContent] = useState('');

  return (
    <View style={styles.wrap}>
      <View style={[styles.panel, { backgroundColor: theme.colors.surface }]}>
        <Text variant="titleMedium" style={styles.title}>Add PDF Resource</Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Only the resource name is required at this foundation stage. File upload will attach to this record later.
        </Text>
        <SegmentedButtons
          value={contentType}
          onValueChange={(value) => setContentType(value as ManagedContentType)}
          buttons={[
            { value: 'notes', label: 'Notes' },
            { value: 'papers', label: 'Papers' },
            { value: 'answers', label: 'Answers' },
          ]}
        />
        <AppTextInput
          label="Resource name"
          placeholder="Example: GCE 2025 Physics Paper 1"
          value={resourceName}
          onChangeText={setResourceName}
        />
        <AppButton icon="file-upload-outline">Submit for Publishing</AppButton>
      </View>

      <View style={[styles.panel, { backgroundColor: theme.colors.surface }]}>
        <Text variant="titleMedium" style={styles.title}>Set Quiz Question</Text>
        <AppTextInput label="Question" multiline value={quizQuestion} onChangeText={setQuizQuestion} />
        <AppTextInput label="Correct answer / explanation" multiline value={quizAnswer} onChangeText={setQuizAnswer} />
        <View style={styles.chips}>
          <Chip selected>Weekly Quiz</Chip>
          <Chip>Topic Practice</Chip>
          <Chip>Competition Drill</Chip>
        </View>
        <AppButton icon="comment-question-outline">Save Question</AppButton>
      </View>

      <View style={[styles.panel, { backgroundColor: theme.colors.surface }]}>
        <Text variant="titleMedium" style={styles.title}>Send Blog or Opportunity</Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          When shared to the forum, students see the channel identity only: Physics Blog or BFA Horizons.
        </Text>
        <SegmentedButtons
          value={publicationChannel}
          onValueChange={(value) => setPublicationChannel(value as PublicationChannel)}
          buttons={[
            { value: 'platform-only', label: 'Platform' },
            { value: 'forum-visible', label: 'Forum' },
          ]}
        />
        <AppTextInput label="Title" value={postTitle} onChangeText={setPostTitle} />
        <AppTextInput label="Image URL" value={postImage} onChangeText={setPostImage} />
        <AppTextInput label="Content" multiline value={postContent} onChangeText={setPostContent} />
        <View style={styles.chips}>
          <Chip selected icon="atom">Physics Blog</Chip>
          <Chip icon="telescope">BFA Horizons</Chip>
        </View>
        <AppButton icon="send-outline">Send Content</AppButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: 16,
  },
  panel: {
    borderRadius: 20,
    gap: 12,
    padding: 18,
  },
  title: {
    fontWeight: '800',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
