import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from '../context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0b0b0c' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="home" />
        <Stack.Screen name="carrito" />
        <Stack.Screen name="editor3d" />
      </Stack>
    </CartProvider>
  );
}
