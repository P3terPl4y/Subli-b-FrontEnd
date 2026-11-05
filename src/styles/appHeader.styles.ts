import { StyleSheet } from 'react-native';

export const COLORES = {
  fondo: '#0b0b0c',
  texto: '#fafafa',
  suave: '#aaa9ad',
  amarillo: '#ffd500',
  superficie: '#141415',
  borde: '#ffffff18',
};

export const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
    backgroundColor: COLORES.fondo,
  },

  marca: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  // Imagen del logo (reemplaza el cuadro amarillo con la "S")
  logoImagen: {
    width: 38,
    height: 38,
    borderRadius: 8,
  },

  marcaNombre: { color: COLORES.texto, fontSize: 15, fontWeight: '700' },
  marcaSub: { color: COLORES.suave, fontSize: 10, marginTop: 1 },

  cuenta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
    paddingLeft: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.borde,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: { color: COLORES.amarillo, fontSize: 14, fontWeight: '700' },
  cuentaInfo: { maxWidth: 90 },
  cuentaNombre: { color: COLORES.texto, fontSize: 13, fontWeight: '600' },
  cuentaAccion: { color: COLORES.suave, fontSize: 10 },
});
