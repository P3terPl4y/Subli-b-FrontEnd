import { StyleSheet } from 'react-native';

export const COLORES = {
  fondo: '#0b0b0c',
  texto: '#fafafa',
  suave: '#aaa9ad',
  amarillo: '#ffd500',
  superficie: '#141415',
  borde: '#ffffff18',
  rojo: '#c91d2b',
  rojoSuave: '#c91d2b18',
  rojoTexto: '#ff8a92',
};

export const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: COLORES.fondo },
  centrado: {
    flex: 1,
    backgroundColor: COLORES.fondo,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Contenedor del listado: padding lateral y margen inferior
  // para que la nav no tape las tarjetas
  lista: {
    padding: 16,
    paddingBottom: 100,
  },

  // Fila: separacion horizontal y vertical entre tarjetas.
  // El valor 12 funciona bien con 2 y con 4 columnas.
  fila: {
    gap: 12,
    marginBottom: 12,
  },

  vacio: {
    color: COLORES.suave,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 13,
  },

  errorBox: {
    margin: 20,
    padding: 14,
    borderRadius: 8,
    backgroundColor: COLORES.rojoSuave,
    borderLeftWidth: 3,
    borderLeftColor: COLORES.rojo,
  },
  errorTexto: { color: COLORES.rojoTexto, fontSize: 13 },
});
