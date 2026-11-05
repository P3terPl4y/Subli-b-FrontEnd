import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { getUser, isAuthenticated, logout, User } from '../lib/api';
import { COLORES, styles } from '../styles/appHeader.styles';

export default function AppHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authed, setAuthed] = useState(false);

  // Recarga el estado cada vez que la pantalla gana foco
  // (por ejemplo, al volver del login)
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        const ok = await isAuthenticated();
        const u = ok ? await getUser() : null;
        if (mounted) {
          setAuthed(ok);
          setUser(u);
        }
      })();
      return () => { mounted = false; };
    }, [])
  );

  const onPressCuenta = async () => {
    if (!authed) {
      router.push('/login');
      return;
    }
    await logout();
    setAuthed(false);
    setUser(null);
    router.replace('/home');
  };

  const inicial = (user?.name || '?').charAt(0).toUpperCase();

  return (
    <View style={styles.contenedor}>
      <View style={styles.marca}>
        <View style={styles.logo}>
          <Text style={styles.logoTexto}>S</Text>
        </View>
        <View>
          <Text style={styles.marcaNombre}>Subli-b</Text>
          <Text style={styles.marcaSub}>Shop</Text>
        </View>
      </View>

      <Pressable
        onPress={onPressCuenta}
        hitSlop={8}
        style={({ pressed }) => [styles.cuenta, pressed && { opacity: 0.7 }]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{authed ? inicial : '?'}</Text>
        </View>
        <View style={styles.cuentaInfo}>
          <Text style={styles.cuentaNombre} numberOfLines={1}>
            {authed ? user?.name?.split(' ')[0] || 'Cuenta' : 'Invitado'}
          </Text>
          <Text style={styles.cuentaAccion}>
            {authed ? 'Cerrar sesión' : 'Iniciar sesión'}
          </Text>
        </View>
        <Ionicons
          name={authed ? 'log-out-outline' : 'log-in-outline'}
          size={18}
          color={COLORES.suave}
        />
      </Pressable>
    </View>
  );
}
