import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/navigation/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="learn" options={{ title: 'Learn' }} />
      <Tabs.Screen name="answers" options={{ title: 'Answers' }} />
      <Tabs.Screen name="quiz" options={{ title: 'Quiz' }} />
      <Tabs.Screen name="papers" options={{ title: 'Papers' }} />
    </Tabs>
  );
}
