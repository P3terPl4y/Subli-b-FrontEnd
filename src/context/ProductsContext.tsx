import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import type { Product } from '../lib/types';
import {
  createProduct as storeCreate,
  deleteProduct as storeDelete,
  listProducts,
  resetProducts as storeReset,
  updateProduct as storeUpdate,
} from '../lib/productsStore';

type ProductsContextValue = {
  products: Product[];
  loading: boolean;
  refresh: () => Promise<void>;
  create: (input: Omit<Product, 'id'>) => Promise<void>;
  update: (id: number, input: Omit<Product, 'id'>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  reset: () => Promise<void>;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const items = await listProducts();
    setProducts(items);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (input: Omit<Product, 'id'>) => {
    const next = await storeCreate(input);
    setProducts(next);
  }, []);

  const update = useCallback(async (id: number, input: Omit<Product, 'id'>) => {
    const next = await storeUpdate(id, input);
    setProducts(next);
  }, []);

  const remove = useCallback(async (id: number) => {
    const next = await storeDelete(id);
    setProducts(next);
  }, []);

  const reset = useCallback(async () => {
    const next = await storeReset();
    setProducts(next);
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, refresh, create, update, remove, reset }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts debe usarse dentro de <ProductsProvider>');
  return ctx;
}
