import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { SubjectCard } from '@/components/subjects/SubjectCard';
import { AppButton } from '@/components/ui/AppButton';
import { CustomAppBar } from '@/components/ui/CustomAppBar';
import { Screen } from '@/components/ui/Screen';
import { subjectService } from '@/services/subjectService';
import { useAuth } from '@/hooks/useAuth';

export default function SubjectSelectionScreen() {
  const auth = useAuth();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data = [] } = useQuery({
    queryKey: ['subjects', auth.user?.level],
    queryFn: () => subjectService.listSubjects(auth.user?.level),
  });

  const selectedSubjects = useMemo(() => data.filter((subject) => selectedIds.includes(subject.id)), [data, selectedIds]);

  const toggle = (id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  };

  const continueToProfile = async () => {
    await auth.selectSubjects(selectedSubjects);
    router.replace('/(auth)/complete-profile');
  };

  return (
    <>
      <CustomAppBar title="Choose Subjects" onBack={() => router.back()} />
      <Screen scroll>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>Select your subjects</Text>
          <Text variant="bodyMedium">Physics appears first. Choose all subjects you want Bright Lamda to prepare for.</Text>
        </View>
        <View style={styles.list}>
          {data.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} selected={selectedIds.includes(subject.id)} onPress={() => toggle(subject.id)} />
          ))}
        </View>
        <AppButton disabled={selectedIds.length === 0} onPress={continueToProfile}>Continue</AppButton>
      </Screen>
    </>
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
  list: {
    gap: 12,
    marginBottom: 22,
  },
});
