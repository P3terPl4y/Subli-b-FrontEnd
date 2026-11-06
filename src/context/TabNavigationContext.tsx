import { createContext, useContext, useRef, useState, ReactNode } from 'react';
import type PagerView from 'react-native-pager-view';

export const TAB_ORDER = ['home', 'carrito', 'editor3d'] as const;
export type TabName = typeof TAB_ORDER[number];

type TabNavValue = {
  activeIndex: number;
  activeTab: TabName;
  setActiveIndex: (i: number) => void;
  goToTab: (t: TabName) => void;
  syncFromPager: (i: number) => void;
  pagerRef: React.MutableRefObject<PagerView | null>;
};

const Ctx = createContext<TabNavValue | null>(null);

export function TabNavigationProvider({ children }: { children: ReactNode }) {
  const [activeIndex, setActiveIndexState] = useState(0);
  const pagerRef = useRef<PagerView | null>(null);

  const setActiveIndex = (i: number) => {
    setActiveIndexState(i);
    pagerRef.current?.setPage(i);
  };

  const goToTab = (t: TabName) => {
    const i = TAB_ORDER.indexOf(t);
    if (i >= 0) setActiveIndex(i);
  };

  const syncFromPager = (i: number) => setActiveIndexState(i);

  return (
    <Ctx.Provider
      value={{
        activeIndex,
        activeTab: TAB_ORDER[activeIndex],
        setActiveIndex,
        goToTab,
        syncFromPager,
        pagerRef,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useTabNavigation() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTabNavigation fuera de TabNavigationProvider');
  return v;
}
