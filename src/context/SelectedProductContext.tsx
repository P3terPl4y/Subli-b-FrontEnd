import { createContext, useContext, useState, ReactNode } from 'react';
import type { Product } from '../lib/types';

type Value = {
  selected: Product | null;
  select: (p: Product | null) => void;
};

const Ctx = createContext<Value | null>(null);

export function SelectedProductProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Product | null>(null);
  return (
    <Ctx.Provider value={{ selected, select: setSelected }}>{children}</Ctx.Provider>
  );
}

export function useSelectedProduct() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSelectedProduct fuera de SelectedProductProvider');
  return v;
}
