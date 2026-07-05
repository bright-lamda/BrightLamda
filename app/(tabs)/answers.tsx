import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SegmentedButtons, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { answerPapers } from '@/constants/learningContent';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AppTheme } from '@/theme';

type AnswerTab = 'paper1' | 'paper2' | 'paper3';

export default function AnswersScreen() {
  const theme = useTheme<AppTheme>();
  const [activeTab, setActiveTab] = useState<AnswerTab>('paper1');

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Answers</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Choose a paper to access its answer resources. Content appears only after selecting a paper section.
        </Text>
      </View>

      <SegmentedButtons
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as AnswerTab)}
        buttons={[
          { value: 'paper1', label: 'Paper 1', icon: 'file-pdf-box' },
          { value: 'paper2', label: 'Paper 2', icon: 'file-pdf-box' },
          { value: 'paper3', label: 'Paper 3', icon: 'video-outline' },
        ]}
        style={styles.tabs}
      />

      {activeTab === 'paper1' ? (
        <AnswerResourceList
          title="Paper 1 Answers"
          description="PDF answer keys and worked explanations for multiple-choice Physics questions."
          resources={answerPapers.paper1}
        />
      ) : null}
      {activeTab === 'paper2' ? (
        <AnswerResourceList
          title="Paper 2 Answers"
          description="PDF solutions for structured and theory questions with marking-point guidance."
          resources={answerPapers.paper2}
        />
      ) : null}
      {activeTab === 'paper3' ? (
        <AnswerResourceList
          title="Paper 3 Answers"
          description="Practical Physics answers with both video demonstrations and PDF solution guides."
          resources={answerPapers.paper3}
        />
      ) : null}
    </Screen>
  );
}

interface AnswerResourceListProps {
  title: string;
  description: string;
  resources: ReadonlyArray<{
    title: string;
    year: string;
    format: 'PDF' | 'Video';
    size?: string;
    duration?: string;
  }>;
}

const AnswerResourceList = ({ title, description, resources }: AnswerResourceListProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <View style={styles.content}>
      <SectionHeader title={title} />
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{description}</Text>
      <View style={styles.list}>
        {resources.map((resource) => {
          const isVideo = resource.format === 'Video';

          return (
            <TouchableRipple key={resource.title} borderless style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.cardInner}>
                <View style={[styles.icon, { backgroundColor: isVideo ? '#D4A3FF' : theme.colors.surfaceVariant }]}>
                  <MaterialCommunityIcons name={isVideo ? 'play-circle-outline' : 'file-pdf-box'} size={24} color={theme.custom.colors.primary} />
                </View>
                <View style={styles.copy}>
                  <Text variant="titleSmall" style={styles.title}>{resource.title}</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {resource.year} - {resource.format} - {resource.duration ?? resource.size}
                  </Text>
                </View>
                <MaterialCommunityIcons name={isVideo ? 'play-outline' : 'download-outline'} size={22} color={theme.colors.primary} />
              </View>
            </TouchableRipple>
          );
        })}
      </View>
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
  tabs: {
    marginBottom: 18,
  },
  content: {
    gap: 12,
    paddingBottom: 78,
  },
  list: {
    gap: 12,
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  cardInner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
});
