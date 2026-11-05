import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORES, styles } from '../styles/productCard.styles';
import type { Product } from '../lib/types';

type Props = {
  product: Product;
  onAdd?: (product: Product) => void;
  onPress?: (product: Product) => void;
};

export default function ProductCard({ product, onAdd, onPress }: Props) {
  const [favorito, setFavorito] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Animated.Value controla el "pop" al presionar la tarjeta
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: pressed ? 0.965 : 1,
      useNativeDriver: true,
      friction: 6,
      tension: 250,
    }).start();
  }, [pressed, scale]);

  const precioFormateado = `$${product.price.toLocaleString('es-CU', {
    minimumFractionDigits: 2,
  })}`;

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <Pressable
        onPress={() => onPress?.(product)}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={({ pressed: p }) => [
          styles.tarjeta,
          {
            // Sombra más intensa al presionar: la tarjeta "despega"
            shadowOpacity: p ? 0.45 : 0.28,
            shadowRadius: p ? 14 : 10,
            elevation: p ? 8 : 4,
          },
        ]}
      >
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
            style={({ pressed: p }) => [
              styles.favorito,
              p && { transform: [{ scale: 0.9 }] },
            ]}
          >
            <Ionicons
              name={favorito ? 'heart' : 'heart-outline'}
              size={18}
              color={favorito ? COLORES.rojo : COLORES.texto}
            />
          </Pressable>
        </View>

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
              style={({ pressed: p }) => [
                styles.botonAgregar,
                { transform: [{ scale: p ? 0.88 : 1 }] },
                p && styles.botonAgregarPresionado,
              ]}
            >
              <Ionicons name="add" size={18} color={COLORES.fondo} />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
