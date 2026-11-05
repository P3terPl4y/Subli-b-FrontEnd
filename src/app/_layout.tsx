import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Layout raíz: solo define el Stack de navegación y el tema oscuro.
// No usa tabs ni depende de componentes del template.
export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0b0b0c' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="panel" />
      </Stack>
    </>
  );
}
