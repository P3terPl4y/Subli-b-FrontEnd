import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { styles } from '../styles/bottomNav.styles';

type Tab = {
  path: '/home' | '/carrito' | '/editor3d';
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
};

const TABS: Tab[] = [
  { path: '/home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { path: '/carrito', label: 'Carrito', icon: 'cart-outline', iconActive: 'cart' },
  { path: '/editor3d', label: 'Editor 3D', icon: 'cube-outline', iconActive: 'cube' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { count } = useCart();
  const { colors, mode } = useTheme();
  // Espacio reservado por la barra del sistema (gestos o botones)
  const insets = useSafeAreaInsets();

  const go = (path: Tab['path']) => {
    if (pathname !== path) router.replace(path);
  };

  return (
    <View
      style={[
        styles.contenedor,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          // La nav de la app queda por encima de la del telefono:
          // se respeta la zona segura inferior con un minimo estetico
          paddingBottom: Math.max(insets.bottom, 10),
          // Sombra superior para separar visualmente del contenido
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: mode === 'dark' ? 0.5 : 0.12,
          shadowRadius: 10,
          elevation: 12,
        },
      ]}
    >
      {TABS.map((tab) => {
        const activo = pathname === tab.path;
        return (
          <Pressable
            key={tab.path}
            onPress={() => go(tab.path)}
            android_ripple={{ color: colors.primary + '33', borderless: true }}
            style={({ pressed }) => [
              styles.item,
              pressed && { transform: [{ scale: 0.94 }], opacity: 0.85 },
            ]}
          >
            <View style={styles.iconoContenedor}>
              <Ionicons
                name={activo ? tab.iconActive : tab.icon}
                size={22}
                color={activo ? colors.primary : colors.textMuted}
              />
              {tab.path === '/carrito' && count > 0 && (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: colors.primary,
                      shadowColor: colors.primary,
                      shadowOpacity: 0.6,
                      shadowRadius: 6,
                      elevation: 4,
                    },
                  ]}
                >
                  <Text style={[styles.badgeTexto, { color: colors.background }]}>
                    {count}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.label,
                { color: activo ? colors.primary : colors.textMuted },
                activo && styles.labelActivo,
              ]}
            >
              {tab.label}
            </Text>

            {/* Indicador inferior del tab activo */}
            {activo && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: 24,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: colors.primary,
                }}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
