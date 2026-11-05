import { StyleSheet } from 'react-native';

export const COLORES = {
  fondo: '#0b0b0c',
  texto: '#fafafa',
  suave: '#aaa9ad',
  amarillo: '#ffd500',
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
  titulo: {
    color: COLORES.texto,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
  },
  sub: {
    color: COLORES.suave,
    fontSize: 13,
    textAlign: 'center',
  },
  boton: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORES.amarillo,
  },
  botonTexto: { color: COLORES.fondo, fontWeight: '700', fontSize: 13 },
});
