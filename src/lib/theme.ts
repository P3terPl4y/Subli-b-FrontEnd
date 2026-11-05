// Paletas completas para los dos modos. Cada modo define todos los tokens
// que usan los componentes, así no hay valores sueltos por la app.
export type ThemeMode = 'dark' | 'light';

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryPressed: string;
  danger: string;
  dangerSoft: string;
  success: string;
};

export const PALETTES: Record<ThemeMode, ThemeColors> = {
  dark: {
    background: '#0b0b0c',
    surface: '#141415',
    surfaceAlt: '#1c1c1e',
    text: '#fafafa',
    textMuted: '#aaa9ad',
    border: '#ffffff18',
    primary: '#ffd500',
    primaryPressed: '#e6c000',
    danger: '#c91d2b',
    dangerSoft: '#c91d2b18',
    success: '#4fc7a1',
  },
  light: {
    background: '#f5f5f7',
    surface: '#ffffff',
    surfaceAlt: '#eeeef2',
    text: '#0b0b0c',
    textMuted: '#5a5a63',
    border: '#00000015',
    primary: '#ffd500',
    primaryPressed: '#e6c000',
    danger: '#c91d2b',
    dangerSoft: '#c91d2b15',
    success: '#1e8f6a',
  },
};
