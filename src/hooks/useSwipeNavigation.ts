import { useRef } from 'react';
import { PanResponder } from 'react-native';
import { usePathname, useRouter } from 'expo-router';

// Orden de los tabs del BottomNav. Swipe a la izquierda avanza,
// swipe a la derecha retrocede.
const TABS = ['/home', '/carrito', '/editor3d'];

export function useSwipeNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const currentIndex = TABS.indexOf(pathname);

  const responder = useRef(
    PanResponder.create({
      // Solo captura si el gesto es claramente horizontal
      onMoveShouldSetPanResponder: (_, g) => {
        return Math.abs(g.dx) > 24 && Math.abs(g.dx) > Math.abs(g.dy) * 1.8;
      },
      onPanResponderRelease: (_, g) => {
        if (currentIndex === -1) return;
        // Deslizar hacia la izquierda -> siguiente tab
        if (g.dx < -60 && currentIndex < TABS.length - 1) {
          router.replace(TABS[currentIndex + 1] as any);
        }
        // Deslizar hacia la derecha -> tab anterior
        else if (g.dx > 60 && currentIndex > 0) {
          router.replace(TABS[currentIndex - 1] as any);
        }
      },
    })
  ).current;

  return responder.panHandlers;
}
