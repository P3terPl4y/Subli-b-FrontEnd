import { storage } from './storage';

export type PaymentMethod = {
  id: string;
  type: 'card' | 'paypal';
  label: string;
  last4?: string;
  isDefault: boolean;
};

const KEY = 'subli_payment_methods';

export async function listPayments(): Promise<PaymentMethod[]> {
  const raw = await storage.get(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export async function savePayments(items: PaymentMethod[]): Promise<void> {
  await storage.set(KEY, JSON.stringify(items));
}

export async function addPayment(
  input: Omit<PaymentMethod, 'id' | 'isDefault'>
): Promise<PaymentMethod[]> {
  const current = await listPayments();
  const method: PaymentMethod = {
    ...input,
    id: `pm-${Date.now()}`,
    isDefault: current.length === 0,
  };
  const next = [...current, method];
  await savePayments(next);
  return next;
}

export async function removePayment(id: string): Promise<PaymentMethod[]> {
  const current = await listPayments();
  const next = current.filter((p) => p.id !== id);
  // Si borramos el default y quedan items, el primero pasa a default
  if (!next.some((p) => p.isDefault) && next.length > 0) {
    next[0].isDefault = true;
  }
  await savePayments(next);
  return next;
}

export async function setDefaultPayment(id: string): Promise<PaymentMethod[]> {
  const current = await listPayments();
  const next = current.map((p) => ({ ...p, isDefault: p.id === id }));
  await savePayments(next);
  return next;
}
