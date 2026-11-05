import { StyleSheet } from 'react-native';

export const COLORES = {
  fondo: '#0b0b0c',
  texto: '#fafafa',
  suave: '#aaa9ad',
  amarillo: '#ffd500',
  amarilloPresionado: '#e6c000',
  rojo: '#e04a55',
  superficie: '#141415',
  superficieAlta: '#1c1c1e',
  borde: '#ffffff18',
  nuevo: '#4fc7a1',
  oferta: '#e04a55',
};

export const styles = StyleSheet.create({
  // Tarjeta exterior: fondo, borde sutil, esquinas redondeadas y sombra
  tarjeta: {
    flex: 1,
    backgroundColor: COLORES.superficie,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORES.borde,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  tarjetaPresionada: {
    // En RN no hay :active, usamos opacity para dar feedback tactil
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },

  // Contenedor de la imagen con aspect ratio 1:1
  imagenContenedor: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORES.superficieAlta,
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  sinImagen: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Badge "Nuevo" u "Oferta" en la esquina superior izquierda
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeNuevo: {
    backgroundColor: COLORES.nuevo,
  },
  badgeOferta: {
    backgroundColor: COLORES.oferta,
  },
  badgeTexto: {
    color: COLORES.fondo,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  // Boton circular de favorito en la esquina superior derecha
  favorito: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Cuerpo de la tarjeta: nombre, descripcion, precio y boton
  cuerpo: {
    padding: 12,
    gap: 6,
  },
  nombre: {
    color: COLORES.texto,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  descripcion: {
    color: COLORES.suave,
    fontSize: 11,
    lineHeight: 15,
  },

  // Pie: precio a la izquierda, boton agregar a la derecha
  pie: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  precio: {
    color: COLORES.amarillo,
    fontSize: 16,
    fontWeight: '700',
  },
  botonAgregar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORES.amarillo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonAgregarPresionado: {
    backgroundColor: COLORES.amarilloPresionado,
  },
});
