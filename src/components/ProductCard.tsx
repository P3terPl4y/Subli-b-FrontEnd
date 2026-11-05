import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORES, styles } from '../styles/productCard.styles';
import type { Product } from '../lib/types';

type Props = {
  product: Product;
  onAdd?: (product: Product) => void;
  onPress?: (product: Product) => void;
};

export default function ProductCard({ product, onAdd, onPress }: Props) {
  // Estado local del favorito: se reinicia al desmontar la tarjeta
  // (cuando haya persistencia real, se subira al contexto o al backend)
  const [favorito, setFavorito] = useState(false);

  const precioFormateado = `$${product.price.toLocaleString('es-CU', {
    minimumFractionDigits: 2,
  })}`;

  return (
    <Pressable
      style={({ pressed }) => [styles.tarjeta, pressed && styles.tarjetaPresionada]}
      onPress={() => onPress?.(product)}
    >
      {/* Imagen con badge y boton de favorito superpuestos */}
      <View style={styles.imagenContenedor}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.imagen} />
        ) : (
          <View style={[styles.imagen, styles.sinImagen]}>
            <Ionicons name="image-outline" size={28} color={COLORES.suave} />
          </View>
        )}

        {product.badge ? (
          <View
            style={[
              styles.badge,
              product.badge === 'oferta' ? styles.badgeOferta : styles.badgeNuevo,
            ]}
          >
            <Text style={styles.badgeTexto}>
              {product.badge === 'oferta' ? 'Oferta' : 'Nuevo'}
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={() => setFavorito((v) => !v)}
          hitSlop={10}
          style={styles.favorito}
        >
          <Ionicons
            name={favorito ? 'heart' : 'heart-outline'}
            size={18}
            color={favorito ? COLORES.rojo : COLORES.texto}
          />
        </Pressable>
      </View>

      {/* Cuerpo: nombre, descripcion, precio y boton de agregar */}
      <View style={styles.cuerpo}>
        <Text style={styles.nombre} numberOfLines={2}>
          {product.name}
        </Text>

        {product.description ? (
          <Text style={styles.descripcion} numberOfLines={1}>
            {product.description}
          </Text>
        ) : null}

        <View style={styles.pie}>
          <Text style={styles.precio}>{precioFormateado}</Text>
          <Pressable
            onPress={() => onAdd?.(product)}
            hitSlop={8}
            style={({ pressed }) => [
              styles.botonAgregar,
              pressed && styles.botonAgregarPresionado,
            ]}
          >
            <Ionicons name="add" size={18} color={COLORES.fondo} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
