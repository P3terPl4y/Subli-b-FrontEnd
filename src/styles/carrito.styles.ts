import { StyleSheet } from 'react-native';

export const COLORES = {
  fondo: '#0b0b0c',
  texto: '#fafafa',
  suave: '#aaa9ad',
  amarillo: '#ffd500',
  superficie: '#141415',
  superficieAlta: '#1c1c1e',
  borde: '#ffffff18',
};

export const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: COLORES.fondo },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 24,
  },
  titulo: { color: COLORES.texto, fontSize: 20, fontWeight: '700', marginTop: 8 },
  sub: { color: COLORES.suave, fontSize: 13, textAlign: 'center' },

  lista: { padding: 16, paddingBottom: 120, gap: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  itemImagenContenedor: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORES.superficieAlta,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  itemImagen: { width: '100%', height: '100%' },
  itemInfo: { flex: 1 },
  itemNombre: { color: COLORES.texto, fontSize: 14, fontWeight: '600' },
  itemSub: { color: COLORES.suave, fontSize: 11, marginTop: 2 },

  botonVaciar: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORES.borde,
    alignItems: 'center',
  },
  botonVaciarTexto: { color: COLORES.suave, fontSize: 13, fontWeight: '600' },
});
