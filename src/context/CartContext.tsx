import { createContext, useContext, useState, ReactNode } from 'react';

// Item unificado: sirve para productos del home y para
// personalizaciones del editor 3D.
export type CartItem = {
  id: string;
  kind: 'product' | 'custom';
  label: string;
  textureUri: string | null;
  addedAt: number;
};

type AddInput = {
  kind: 'product' | 'custom';
  label: string;
  textureUri?: string | null;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (item: AddInput) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add: CartContextValue['add'] = ({ kind, label, textureUri }) => {
    setItems((prev) => [
      ...prev,
      {
        id: `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        kind,
        label,
        textureUri: textureUri ?? null,
        addedAt: Date.now(),
      },
    ]);
  };

  const clear = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, count: items.length, add, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
