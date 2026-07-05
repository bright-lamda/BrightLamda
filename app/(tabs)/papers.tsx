import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { paperCategories, paperFilters, samplePapers } from '@/constants/papers';
import { subjects } from '@/constants/subjects';
import { LearningCategoryId } from '@/types/auth';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AppTheme } from '@/theme';

export default function PapersScreen() {
  const theme = useTheme<AppTheme>();
  const [categoryId, setCategoryId] = useState<LearningCategoryId | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const selectedCategory = useMemo(() => paperCategories.find((category) => category.id === categoryId), [categoryId]);
  const availableSubjects = subjects.filter((subject) => subject.id === 'physics');

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Papers</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Choose an examination category, then select a subject and filter past papers by year, session, difficulty, and topic.
        </Text>
      </View>

      <SectionHeader title="Examination Category" />
      <View style={styles.categoryList}>
        {paperCategories.map((category) => {
          const selected = category.id === categoryId;
          return (
            <TouchableRipple
              key={category.id}
              borderless
              onPress={() => {
                setCategoryId(category.id);
                setSubjectId(null);
              }}
              style={[
                styles.categoryCard,
                {
                  backgroundColor: selected ? theme.custom.colors.primary : theme.colors.surface,
                  borderColor: selected ? theme.custom.colors.accent : theme.colors.outline,
                },
              ]}
            >
              <View style={styles.categoryInner}>
                <View style={styles.categoryCopy}>
                  <Text variant="titleSmall" style={{ color: selected ? '#FFFFFF' : theme.colors.onSurface, fontWeight: '800' }}>{category.title}</Text>
                  <Text variant="bodySmall" style={{ color: selected ? '#E7EDF3' : theme.colors.onSurfaceVariant }}>{category.subtitle}</Text>
                  {category.exams ? <Text variant="labelSmall" style={{ color: selected ? '#D4A3FF' : theme.colors.primary, fontWeight: '800' }}>{category.exams.join(' • ')}</Text> : null}
                </View>
                <MaterialCommunityIcons name={selected ? 'check-circle' : 'circle-outline'} size={24} color={selected ? theme.custom.colors.accent : theme.colors.outline} />
              </View>
            </TouchableRipple>
          );
        })}
      </View>

      {selectedCategory ? (
        <>
          <SectionHeader title="Subjects" />
          <View style={styles.chips}>
            {availableSubjects.map((subject) => (
              <Chip key={subject.id} selected={subject.id === subjectId} onPress={() => setSubjectId(subject.id)} icon={subject.icon}>
                {subject.name}
              </Chip>
            ))}
          </View>
        </>
      ) : null}

      {subjectId ? (
        <>
          <SectionHeader title="Filters" />
          <View style={styles.filterBlock}>
            {Object.entries(paperFilters).map(([label, values]) => (
              <View key={label} style={styles.filterGroup}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '800' }}>{label}</Text>
                <View style={styles.chips}>
                  {values.map((value, index) => (
                    <Chip key={value} selected={index === 0}>{value}</Chip>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <SectionHeader title="Past Papers" />
          <View style={styles.paperList}>
            {samplePapers.map((paper) => (
              <View key={paper.id} style={[styles.paperCard, { backgroundColor: theme.colors.surface }]}>
                <MaterialCommunityIcons name="file-document-outline" size={24} color={theme.colors.primary} />
                <View style={styles.categoryCopy}>
                  <Text variant="titleSmall" style={styles.title}>{paper.title}</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {paper.year} • {paper.session} • {paper.difficulty} • {paper.topic}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
    marginBottom: 18,
  },
  title: {
    fontWeight: '800',
  },
  categoryList: {
    gap: 12,
    marginBottom: 24,
    marginTop: 12,
  },
  categoryCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  categoryInner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
  categoryCopy: {
    flex: 1,
    gap: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
    marginTop: 10,
  },
  filterBlock: {
    gap: 8,
    marginTop: 12,
  },
  filterGroup: {
    gap: 2,
  },
  paperList: {
    gap: 12,
    paddingBottom: 78,
  },
  paperCard: {
    alignItems: 'center',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
});
