import { storage } from './storage';
import type { Product } from './types';
import seed from '../data/products.json';

const KEY = 'subli_products_v1';

// Carga la lista de productos. Si nunca se ha guardado nada,
// devuelve el seed del JSON y lo persiste para que el admin lo edite.
export async function listProducts(): Promise<Product[]> {
  const raw = await storage.get(KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Product[];
    } catch {
      // si el JSON se corrompe, caemos al seed
    }
  }
  const initial = seed as Product[];
  await storage.set(KEY, JSON.stringify(initial));
  return initial;
}

export async function saveProducts(items: Product[]): Promise<void> {
  await storage.set(KEY, JSON.stringify(items));
}

// Crea un producto con id autoincremental basado en el maximo actual
export async function createProduct(input: Omit<Product, 'id'>): Promise<Product[]> {
  const current = await listProducts();
  const nextId = current.reduce((max, p) => (p.id > max ? p.id : max), 0) + 1;
  const next = [...current, { ...input, id: nextId }];
  await saveProducts(next);
  return next;
}

export async function updateProduct(id: number, input: Omit<Product, 'id'>): Promise<Product[]> {
  const current = await listProducts();
  const next = current.map((p) => (p.id === id ? { ...input, id } : p));
  await saveProducts(next);
  return next;
}

export async function deleteProduct(id: number): Promise<Product[]> {
  const current = await listProducts();
  const next = current.filter((p) => p.id !== id);
  await saveProducts(next);
  return next;
}

export async function resetProducts(): Promise<Product[]> {
  const initial = seed as Product[];
  await saveProducts(initial);
  return initial;
}
