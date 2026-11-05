// Tipos compartidos entre pantallas, componentes y capa de datos
export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  badge?: 'nuevo' | 'oferta' | null;
};
