import { useEffect } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Pager from '../components/Pager';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import HomeTab from '../components/tabs/HomeTab';
import CarritoTab from '../components/tabs/CarritoTab';
import EditorTab from '../components/tabs/EditorTab';
import { useTheme } from '../context/ThemeContext';
import { useTabNavigation, TAB_ORDER, TabName } from '../context/TabNavigationContext';

export default function MainScreen() {
  const { colors } = useTheme();
  const { activeIndex, syncFromPager, setActiveIndex, pagerRef } = useTabNavigation();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const insets = useSafeAreaInsets();

  // Altura del BottomNav: 60px de contenido + safe area del sistema
  const navHeight = 60 + Math.max(insets.bottom, 10);

  // Si llega ?tab=home|carrito|editor3d, salta a esa página
  useEffect(() => {
    if (tab && TAB_ORDER.includes(tab as TabName)) {
      const i = TAB_ORDER.indexOf(tab as TabName);
      if (i !== activeIndex) setActiveIndex(i);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const pages = [
    <View key="home" style={{ flex: 1 }}><HomeTab /></View>,
    <View key="carrito" style={{ flex: 1 }}><CarritoTab /></View>,
    <View key="editor3d" style={{ flex: 1 }}><EditorTab /></View>,
  ];

  // En web, el componente Pager.web.tsx ignora initialPage y onPageSelected
  // y solo renderiza la página activa. En nativo, Pager.native.tsx usa
  // react-native-pager-view normalmente.
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader />
      <View style={{ flex: 1, paddingBottom: navHeight }}>
        <Pager
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={(e) => syncFromPager(e.nativeEvent.position)}
        >
          {pages}
        </Pager>
      </View>
      <BottomNav />
    </View>
  );
}
