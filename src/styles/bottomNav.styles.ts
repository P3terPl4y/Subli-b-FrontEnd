import { StyleSheet } from 'react-native';

export const COLORES = {
  fondo: '#0b0b0c',
  texto: '#fafafa',
  suave: '#aaa9ad',
  amarillo: '#ffd500',
  borde: '#ffffff18',
};

export const styles = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORES.fondo,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
    paddingTop: 10,
    paddingBottom: 24, // espacio para la barra de gestos
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconoContenedor: {
    position: 'relative',
    width: 32,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: { color: COLORES.suave, fontSize: 10, fontWeight: '500' },
  labelActivo: { color: COLORES.amarillo, fontWeight: '700' },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    minWidth: 15,
    height: 15,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: COLORES.amarillo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTexto: { color: COLORES.fondo, fontSize: 9, fontWeight: '700' },
});
