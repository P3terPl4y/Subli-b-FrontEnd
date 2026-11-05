import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import { useCart } from '../context/CartContext';
import { COLORES, styles } from '../styles/carrito.styles';

export default function CarritoScreen() {
  const { items, count, clear } = useCart();

  return (
    <View style={styles.contenedor}>
      <AppHeader />

      {count === 0 ? (
        <View style={styles.centro}>
          <Ionicons name="cart-outline" size={48} color={COLORES.suave} />
          <Text style={styles.titulo}>Carrito vacío</Text>
          <Text style={styles.sub}>
            Personaliza un producto en el Editor 3D y añádelo.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.lista}>
          {items.map((item) => (
            <View key={item.id} style={styles.item}>
              <View style={styles.itemImagenContenedor}>
                {item.textureUri ? (
                  <Image
                    source={{ uri: item.textureUri }}
                    style={styles.itemImagen}
                  />
                ) : (
                  <Ionicons
                    name={item.kind === 'custom' ? 'cube-outline' : 'bag-outline'}
                    size={22}
                    color={COLORES.suave}
                  />
                )}
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemNombre}>{item.label}</Text>
                <Text style={styles.itemSub}>
                  {item.textureUri
                    ? 'Personalizado'
                    : item.kind === 'custom'
                    ? 'Sin personalizar'
                    : 'Producto del catálogo'}
                </Text>
              </View>
            </View>
          ))}

          <Pressable onPress={clear} style={styles.botonVaciar}>
            <Text style={styles.botonVaciarTexto}>Vaciar carrito</Text>
          </Pressable>
        </ScrollView>
      )}

      <BottomNav />
    </View>
  );
}
