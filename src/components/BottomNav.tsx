import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useTabNavigation, TAB_ORDER, TabName } from '../context/TabNavigationContext';
import { styles } from '../styles/bottomNav.styles';

type TabDef = {
  key: TabName;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
};

const TABS: TabDef[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { key: 'carrito', label: 'Carrito', icon: 'cart-outline', iconActive: 'cart' },
  { key: 'editor3d', label: 'Editor 3D', icon: 'cube-outline', iconActive: 'cube' },
];

export default function BottomNav() {
  const { count } = useCart();
  const { colors, mode } = useTheme();
  const { activeTab, goToTab } = useTabNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.contenedor,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 10),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: mode === 'dark' ? 0.5 : 0.12,
          shadowRadius: 10,
          elevation: 12,
        },
      ]}
    >
      {TABS.map((tab) => {
        const activo = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => goToTab(tab.key)}
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
              {tab.key === 'carrito' && count > 0 && (
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
