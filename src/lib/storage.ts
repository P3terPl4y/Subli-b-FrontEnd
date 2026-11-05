import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Almacenamiento unificado: usa SecureStore en móvil y localStorage en web.
// Esto evita el error 'getValueWithKeyAsync is not a function' en la web.
// Es una envoltura (wrapper) que abstrae las diferencias de plataforma.
export const storage = {
  async get(key: string): Promise<string | null> {
    // En web, usamos localStorage, que es el equivalente estándar del navegador
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    // En móvil (iOS/Android), usamos SecureStore
    return SecureStore.getItemAsync(key);
  },

  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async remove(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
