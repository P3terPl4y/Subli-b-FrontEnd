import { StyleSheet } from 'react-native';

export const COLORES = {
  fondo: '#0b0b0c',
  texto: '#fafafa',
  suave: '#aaa9ad',
  amarillo: '#ffd500',
  amarilloPresionado: '#e6c000',
  superficie: '#141415',
  superficieAlta: '#1c1c1e',
  borde: '#ffffff18',
  rojoSuave: '#c91d2b18',
  rojoTexto: '#ff8a92',
};

export const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: COLORES.fondo },
  scroll: { paddingBottom: 120 },

  // Fila horizontal de botones de categoría
  filtros: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filtroBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.borde,
    marginRight: 8,
  },
  filtroBtnActivo: {
    backgroundColor: COLORES.amarillo,
    borderColor: COLORES.amarillo,
  },
  filtroTexto: { color: COLORES.suave, fontSize: 13, fontWeight: '500' },
  filtroTextoActivo: { color: COLORES.fondo, fontSize: 13, fontWeight: '700' },

  // Contenedor del canvas 3D
  visor: {
    height: 380,
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },

  // Zona de acciones: subir imagen y añadir al carrito
  acciones: {
    padding: 16,
    gap: 12,
  },
  botonSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORES.amarillo,
    backgroundColor: 'transparent',
  },
  botonSecundarioTexto: {
    color: COLORES.amarillo,
    fontSize: 14,
    fontWeight: '600',
  },

  // Vista previa de la textura elegida
  previewContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  previewImagen: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORES.superficieAlta,
  },
  previewTextos: { flex: 1 },
  previewTitulo: { color: COLORES.texto, fontSize: 13, fontWeight: '600' },
  previewSub: { color: COLORES.suave, fontSize: 11, marginTop: 2 },

  // Botón principal: añadir al carrito
  botonPrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: COLORES.amarillo,
    marginTop: 4,
  },
  botonPrincipalPresionado: {
    backgroundColor: COLORES.amarilloPresionado,
  },
  botonPrincipalTexto: {
    color: COLORES.fondo,
    fontSize: 15,
    fontWeight: '700',
  },

  // Nota de aviso cuando el modelo no está cargado
  notaModelo: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ffd50010',
    borderLeftWidth: 3,
    borderLeftColor: COLORES.amarillo,
  },
  notaTexto: { color: COLORES.suave, fontSize: 12, lineHeight: 17 },
});
