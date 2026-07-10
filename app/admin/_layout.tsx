import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="teacher-login" />
      <Stack.Screen name="system-login" />
      <Stack.Screen name="teacher" />
      <Stack.Screen name="system" />
    </Stack>
  );
}
