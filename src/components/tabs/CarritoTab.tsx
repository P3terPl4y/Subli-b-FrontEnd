import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { COLORES, styles } from '../../styles/carrito.styles';

export default function CarritoScreen() {
  const { items, count, total, clear } = useCart();
  const { colors } = useTheme();

  return (
    <View style={[styles.contenedor, { backgroundColor: colors.background }]}>
      {count === 0 ? (
        <View style={styles.centro}>
          <Ionicons name="cart-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.titulo, { color: colors.text }]}>Carrito vacío</Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>
            Personaliza un producto desde el catálogo o el Editor 3D.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.lista}>
          {items.map((item) => (
            <View
              key={item.id}
              style={[
                styles.item,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.itemImagenContenedor,
                  { backgroundColor: colors.surfaceAlt },
                ]}
              >
                {item.textureUri ? (
                  <Image
                    source={{ uri: item.textureUri }}
                    style={styles.itemImagen}
                  />
                ) : (
                  <Ionicons
                    name={item.kind === 'custom' ? 'cube-outline' : 'bag-outline'}
                    size={22}
                    color={colors.textMuted}
                  />
                )}
              </View>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemNombre, { color: colors.text }]}>
                  {item.label}
                </Text>
                <Text style={[styles.itemSub, { color: colors.textMuted }]}>
                  {item.textureUri
                    ? 'Personalizado'
                    : item.kind === 'custom'
                    ? 'Sin personalizar'
                    : 'Producto del catálogo'}
                </Text>
              </View>
              {item.price !== undefined && (
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 14,
                    fontWeight: '700',
                  }}
                >
                  ${item.price.toFixed(2)}
                </Text>
              )}
            </View>
          ))}

          <View
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 10,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>Total</Text>
            <Text
              style={{ color: colors.primary, fontSize: 18, fontWeight: '800' }}
            >
              ${total.toFixed(2)}
            </Text>
          </View>

          <Pressable
            onPress={clear}
            style={[styles.botonVaciar, { borderColor: colors.border }]}
          >
            <Text style={[styles.botonVaciarTexto, { color: colors.textMuted }]}>
              Vaciar carrito
            </Text>
          </Pressable>
        </ScrollView>
      )}

      </View>
  );
}
