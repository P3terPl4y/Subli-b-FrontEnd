// Registro central de plantillas 3D por categoría.
// Las claves coinciden con las categorías que se muestran en el editor.
export type TemplateCategory = 'pullover' | 'gorra' | 'vaso' | 'pantalon' | 'short';

// Si el archivo .glb no existe todavía, el valor es null y el visor
// mostrará un cubo de placeholder para que puedas probar el flujo.
export const TEMPLATES: Record<TemplateCategory, number | null> = {
  pullover: null,
  gorra: null,
  vaso: null,
  pantalon: null,
  short: null,
};

// Etiquetas legibles para los botones del selector
export const TEMPLATE_LABELS: Record<TemplateCategory, string> = {
  pullover: 'Pullover',
  gorra: 'Gorra',
  vaso: 'Vaso',
  pantalon: 'Pantalón',
  short: 'Short',
};
