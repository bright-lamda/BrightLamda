import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Chip, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { AppButton } from '@/components/ui/AppButton';
import { AppTextInput } from '@/components/ui/AppTextInput';
import { adminService, CreatePdfResourcePayload } from '@/services/adminService';
import { ManagedContentType, PublicationChannel } from '@/types/admin';
import { AppTheme } from '@/theme';

type EducationCategory = CreatePdfResourcePayload['educationCategory'];
type PublicationType = 'physics_blog' | 'bfa_horizons';
type QuizMode = 'weekly' | 'topic' | 'competition';

const contentTypeMap: Record<ManagedContentType, CreatePdfResourcePayload['type']> = {
  notes: 'note',
  papers: 'paper',
  answers: 'answer',
};

const paperKindFor = (type: ManagedContentType, resourceName: string): CreatePdfResourcePayload['paperKind'] => {
  if (type !== 'papers' && type !== 'answers') return undefined;
  const lower = resourceName.toLowerCase();
  if (lower.includes('paper 2')) return 'paper_2';
  if (lower.includes('paper 3')) return 'paper_3';
  return 'paper_1';
};

const parseOptions = (value: string) => value.split(',').map((option) => option.trim()).filter(Boolean);

export const AdminResourceForms = () => {
  const theme = useTheme<AppTheme>();
  const [contentType, setContentType] = useState<ManagedContentType>('notes');
  const [educationCategory, setEducationCategory] = useState<EducationCategory>('ordinary_physics');
  const [resourceName, setResourceName] = useState('');
  const [quizMode, setQuizMode] = useState<QuizMode>('weekly');
  const [quizTitle, setQuizTitle] = useState('Weekly Physics Quiz');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOptions, setQuizOptions] = useState('A, B, C, D');
  const [quizCorrectAnswer, setQuizCorrectAnswer] = useState('');
  const [quizExplanation, setQuizExplanation] = useState('');
  const [publicationChannel, setPublicationChannel] = useState<PublicationChannel>('platform-only');
  const [publicationType, setPublicationType] = useState<PublicationType>('physics_blog');
  const [postTitle, setPostTitle] = useState('');
  const [postImage, setPostImage] = useState('');
  const [postContent, setPostContent] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const subjectsQuery = useQuery({ queryKey: ['admin', 'subjects'], queryFn: adminService.listSubjects });
  const physicsSubject = useMemo(() => subjectsQuery.data?.find((subject) => subject.slug === 'physics') ?? subjectsQuery.data?.[0], [subjectsQuery.data]);

  const pdfMutation = useMutation({
    mutationFn: adminService.createPdfResource,
    onSuccess: () => {
      setStatusMessage('PDF resource submitted.');
      setResourceName('');
    },
    onError: (error) => setStatusMessage(error instanceof Error ? error.message : 'Unable to submit PDF resource.'),
  });

  const publicationMutation = useMutation({
    mutationFn: adminService.createPublication,
    onSuccess: () => {
      setStatusMessage('Publication submitted.');
      setPostTitle('');
      setPostImage('');
      setPostContent('');
    },
    onError: (error) => setStatusMessage(error instanceof Error ? error.message : 'Unable to submit publication.'),
  });

  const quizMutation = useMutation({
    mutationFn: adminService.createQuizWithQuestion,
    onSuccess: () => {
      setStatusMessage('Quiz draft and question saved.');
      setQuizQuestion('');
      setQuizCorrectAnswer('');
      setQuizExplanation('');
    },
    onError: (error) => setStatusMessage(error instanceof Error ? error.message : 'Unable to save quiz question.'),
  });

  const submitPdfResource = () => {
    if (!physicsSubject) {
      setStatusMessage('Physics subject is not available yet.');
      return;
    }

    pdfMutation.mutate({
      type: contentTypeMap[contentType],
      name: resourceName.trim(),
      educationCategory,
      subjectId: physicsSubject.id,
      paperKind: paperKindFor(contentType, resourceName),
    });
  };

  const submitPublication = () => {
    publicationMutation.mutate({
      type: publicationType,
      title: postTitle.trim(),
      imageUrl: postImage.trim() || undefined,
      content: postContent.trim(),
      visibleInForum: publicationChannel === 'forum-visible',
    });
  };

  const submitQuizQuestion = () => {
    if (!physicsSubject) {
      setStatusMessage('Physics subject is not available yet.');
      return;
    }

    quizMutation.mutate({
      title: quizTitle.trim(),
      mode: quizMode,
      educationCategory,
      subjectId: physicsSubject.id,
      question: quizQuestion.trim(),
      options: parseOptions(quizOptions),
      correctAnswer: quizCorrectAnswer.trim(),
      explanation: quizExplanation.trim(),
    });
  };

  return (
    <View style={styles.wrap}>
      {statusMessage ? <Text style={[styles.status, { color: theme.colors.primary }]}>{statusMessage}</Text> : null}
      {subjectsQuery.isError ? <Text style={{ color: theme.colors.error }}>Unable to load subjects from backend.</Text> : null}

      <View style={[styles.panel, { backgroundColor: theme.colors.surface }]}>
        <Text variant="titleMedium" style={styles.title}>Add PDF Resource</Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          This creates the content record now. File attachment will use the signed upload flow next.
        </Text>
        <SegmentedButtons
          value={educationCategory}
          onValueChange={(value) => setEducationCategory(value as EducationCategory)}
          buttons={[
            { value: 'ordinary_physics', label: 'O Level' },
            { value: 'advanced_physics', label: 'A Level' },
            { value: 'competitive_physics', label: 'Concours' },
          ]}
        />
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
        <AppButton icon="file-upload-outline" loading={pdfMutation.isPending} disabled={!resourceName.trim() || !physicsSubject} onPress={submitPdfResource}>Submit for Publishing</AppButton>
      </View>

      <View style={[styles.panel, { backgroundColor: theme.colors.surface }]}>
        <Text variant="titleMedium" style={styles.title}>Set Quiz Question</Text>
        <SegmentedButtons
          value={quizMode}
          onValueChange={(value) => setQuizMode(value as QuizMode)}
          buttons={[
            { value: 'weekly', label: 'Weekly' },
            { value: 'topic', label: 'Topic' },
            { value: 'competition', label: 'Concours' },
          ]}
        />
        <AppTextInput label="Quiz title" value={quizTitle} onChangeText={setQuizTitle} />
        <AppTextInput label="Question" multiline value={quizQuestion} onChangeText={setQuizQuestion} />
        <AppTextInput label="Options separated by commas" value={quizOptions} onChangeText={setQuizOptions} />
        <AppTextInput label="Correct answer" value={quizCorrectAnswer} onChangeText={setQuizCorrectAnswer} />
        <AppTextInput label="Explanation" multiline value={quizExplanation} onChangeText={setQuizExplanation} />
        <AppButton icon="comment-question-outline" loading={quizMutation.isPending} disabled={!quizTitle.trim() || !quizQuestion.trim() || parseOptions(quizOptions).length < 2 || !quizCorrectAnswer.trim() || !quizExplanation.trim()} onPress={submitQuizQuestion}>Save Question</AppButton>
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
        <View style={styles.chips}>
          <Chip selected={publicationType === 'physics_blog'} icon="atom" onPress={() => setPublicationType('physics_blog')}>Physics Blog</Chip>
          <Chip selected={publicationType === 'bfa_horizons'} icon="telescope" onPress={() => setPublicationType('bfa_horizons')}>BFA Horizons</Chip>
        </View>
        <AppTextInput label="Title" value={postTitle} onChangeText={setPostTitle} />
        <AppTextInput label="Image URL" value={postImage} onChangeText={setPostImage} />
        <AppTextInput label="Content" multiline value={postContent} onChangeText={setPostContent} />
        <AppButton icon="send-outline" loading={publicationMutation.isPending} disabled={!postTitle.trim() || postContent.trim().length < 20} onPress={submitPublication}>Send Content</AppButton>
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
  status: {
    fontWeight: '700',
    textAlign: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
