import { useCallback, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { getUser, isAdmin, isAuthenticated, User } from '../lib/api';
import { useTheme } from '../context/ThemeContext';
import { styles } from '../styles/appHeader.styles';

export default function AppHeader() {
  const router = useRouter();
  const { colors } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [authed, setAuthed] = useState(false);
  const [admin, setAdmin] = useState(false);

  // Al ganar foco, recarga sesion, usuario y rol.
  // Asi el boton de admin aparece o desaparece segun el rol real.
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        const ok = await isAuthenticated();
        const u = ok ? await getUser() : null;
        const a = ok ? await isAdmin() : false;
        if (mounted) {
          setAuthed(ok);
          setUser(u);
          setAdmin(a);
        }
      })();
      return () => { mounted = false; };
    }, [])
  );

  const onPressCuenta = () => {
    if (!authed) router.push('/login');
    else router.push('/settings');
  };

  const inicial = (user?.name || '?').charAt(0).toUpperCase();

  return (
    <View
      style={[
        styles.contenedor,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 8,
          elevation: 6,
        },
      ]}
    >
      <View style={styles.marca}>
        <Image
          source={require('../../assets/logo/LOGO.png')}
          style={styles.logoImagen}
          resizeMode="contain"
        />
        <View>
          <Text style={[styles.marcaNombre, { color: colors.text }]}>Subli-b</Text>
          <Text style={[styles.marcaSub, { color: colors.textMuted }]}>Shop</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {/* Solo visible si el rol es admin o debug. Se recalcula al ganar foco */}
        {admin && (
          <Pressable
            onPress={() => router.push('/admin')}
            hitSlop={8}
            style={{ padding: 8 }}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color={colors.primary}
            />
          </Pressable>
        )}

        <Pressable
          onPress={onPressCuenta}
          hitSlop={8}
          style={({ pressed }) => [styles.cuenta, pressed && { opacity: 0.7 }]}
        >
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.avatarTexto, { color: colors.primary }]}>
              {authed ? inicial : '?'}
            </Text>
          </View>
          <View style={styles.cuentaInfo}>
            <Text style={[styles.cuentaNombre, { color: colors.text }]} numberOfLines={1}>
              {authed ? user?.name?.split(' ')[0] || 'Cuenta' : 'Invitado'}
            </Text>
            <Text style={[styles.cuentaAccion, { color: colors.textMuted }]}>
              {authed ? 'Mi cuenta' : 'Iniciar sesión'}
            </Text>
          </View>
          <Ionicons
            name={authed ? 'settings-outline' : 'log-in-outline'}
            size={18}
            color={colors.textMuted}
          />
        </Pressable>
      </View>
    </View>
  );
}
