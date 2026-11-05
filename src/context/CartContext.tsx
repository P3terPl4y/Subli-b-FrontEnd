import { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
  id: string;
  kind: 'product' | 'custom';
  label: string;
  textureUri: string | null;
  price?: number;
  productId?: number;
  addedAt: number;
};

type AddInput = {
  kind: 'product' | 'custom';
  label: string;
  textureUri?: string | null;
  price?: number;
  productId?: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: AddInput) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add: CartContextValue['add'] = ({ kind, label, textureUri, price, productId }) => {
    setItems((prev) => [
      ...prev,
      {
        id: `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        kind,
        label,
        textureUri: textureUri ?? null,
        price,
        productId,
        addedAt: Date.now(),
      },
    ]);
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, it) => sum + (it.price ?? 0), 0);

  return (
    <CartContext.Provider value={{ items, count: items.length, total, add, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
