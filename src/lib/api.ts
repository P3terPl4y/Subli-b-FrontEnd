import { storage } from './storage';

// Cambia por la IP LAN de tu PC (la misma que muestra Metro: exp://192.168.x.x:8081)
// y el puerto donde corre tu backend.
export const API_URL = 'http://192.168.1.112:3000';

const TOKEN_KEY = 'subli_b_token';
const USER_KEY = 'subli_b_user';

export type User = {
  id: string | number;
  name: string;
  email: string;
  role?: string;
};

export type LoginResponse = { token: string; user: User };

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Credenciales incorrectas');
  if (!data?.token || !data?.user) throw new Error('Respuesta del servidor invalida');
  await storage.set(TOKEN_KEY, data.token);
  await storage.set(USER_KEY, JSON.stringify(data.user));
  return data;
}

export async function logout(): Promise<void> {
  await storage.remove(TOKEN_KEY);
  await storage.remove(USER_KEY);
}

export async function getToken(): Promise<string | null> {
  return storage.get(TOKEN_KEY);
}

export async function getUser(): Promise<User | null> {
  const raw = await storage.get(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export async function isAuthenticated(): Promise<boolean> {
  return !!(await getToken());
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) await logout();
    throw new Error(data?.message || `Error ${res.status}`);
  }
  return data as T;
}

// Solo disponible en desarrollo. Crea una sesión falsa para probar
// el flujo sin backend. En producción el botón que la llama no se muestra.
declare const __DEV__: boolean;

export async function loginDebug(): Promise<void> {
  if (!__DEV__) throw new Error('Solo disponible en desarrollo');
  await storage.set(TOKEN_KEY, 'debug-token');
  await storage.set(
    USER_KEY,
    JSON.stringify({
      id: 'debug',
      name: 'Invitado Debug',
      email: 'debug@local',
      role: 'debug',
    })
  );
}

// Devuelve true solo si hay sesión y el rol es admin o debug.
// Se usa para proteger el panel y para mostrar u ocultar el botón.
export async function isAdmin(): Promise<boolean> {
  const u = await getUser();
  if (!u) return false;
  return u.role === 'admin' || u.role === 'debug';
}
