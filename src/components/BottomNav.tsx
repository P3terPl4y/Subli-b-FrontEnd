import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';
import { COLORES, styles } from '../styles/bottomNav.styles';

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

  // Evita un replace sobre la misma ruta (parpadeo innecesario)
  const go = (path: Tab['path']) => {
    if (pathname !== path) router.replace(path);
  };

  return (
    <View style={styles.contenedor}>
      {TABS.map((tab) => {
        const activo = pathname === tab.path;
        return (
          <Pressable
            key={tab.path}
            onPress={() => go(tab.path)}
            style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
          >
            <View style={styles.iconoContenedor}>
              <Ionicons
                name={activo ? tab.iconActive : tab.icon}
                size={22}
                color={activo ? COLORES.amarillo : COLORES.suave}
              />
              {/* Contador solo en la pestaña del carrito */}
              {tab.path === '/carrito' && count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeTexto}>{count}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, activo && styles.labelActivo]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
