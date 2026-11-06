import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from '../context/CartContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { ProductsProvider } from '../context/ProductsContext';
import { TabNavigationProvider } from '../context/TabNavigationContext';
import { SelectedProductProvider } from '../context/SelectedProductContext';

function InnerLayout() {
  const { mode, colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="main" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="admin" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ProductsProvider>
          <TabNavigationProvider>
            <SelectedProductProvider>
              <CartProvider>
                <InnerLayout />
              </CartProvider>
            </SelectedProductProvider>
          </TabNavigationProvider>
        </ProductsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
