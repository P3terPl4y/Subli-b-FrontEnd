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

  // Bloque izquierdo: logo + nombre de la app
  marca: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: COLORES.amarillo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoTexto: { color: COLORES.fondo, fontSize: 18, fontWeight: '800' },
  marcaNombre: { color: COLORES.texto, fontSize: 15, fontWeight: '700' },
  marcaSub: { color: COLORES.suave, fontSize: 10, marginTop: 1 },

  // Bloque derecho: avatar + nombre + boton de salir
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
