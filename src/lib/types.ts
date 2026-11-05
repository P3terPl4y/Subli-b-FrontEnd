import type { TemplateCategory } from './templates';

// Producto del catálogo. `template` indica qué modelo 3D usar
// cuando el usuario pulse la tarjeta para personalizarlo.
export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  badge?: 'nuevo' | 'oferta' | null;
  template?: TemplateCategory;
};
