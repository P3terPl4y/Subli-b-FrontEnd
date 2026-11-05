import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import ModelViewer from '../components/ModelViewer';
import { useGuardedCart } from '../hooks/useGuardedCart';
import { useTheme } from '../context/ThemeContext';
import {
  TEMPLATES,
  TEMPLATE_LABELS,
  TemplateCategory,
} from '../lib/templates';
import productsMock from '../data/products.json';
import type { Product } from '../lib/types';
import { COLORES, styles } from '../styles/editor3d.styles';

const CATEGORIAS: TemplateCategory[] = [
  'pullover',
  'gorra',
  'vaso',
  'pantalon',
  'short',
];

export default function Editor3DScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { tryAdd } = useGuardedCart();
  const swipeHandlers = useSwipeNavigation();

  // Si se entra desde el home con ?productId=2, precargamos ese producto
  const { productId } = useLocalSearchParams<{ productId?: string }>();

  const producto = useMemo<Product | null>(() => {
    if (!productId) return null;
    return (productsMock as Product[]).find((p) => String(p.id) === productId) || null;
  }, [productId]);

  // La categoría inicial viene del producto (si tiene template) o es pullover
  const [categoria, setCategoria] = useState<TemplateCategory>(
    producto?.template ?? 'pullover'
  );
  const [textureUri, setTextureUri] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState(false);

  const esModoProducto = producto !== null;

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setTextureUri(result.assets[0].uri);
    }
  };

  const enviarAlCarrito = async () => {
    // Si viene con producto, usamos su nombre y precio reales.
    // Si es modo libre, usamos la etiqueta de la categoría.
    await tryAdd({
      kind: 'custom',
      label: producto?.name ?? TEMPLATE_LABELS[categoria],
      textureUri,
      price: producto?.price,
      productId: producto?.id,
    });
    setConfirmado(true);
    setTimeout(() => setConfirmado(false), 2000);
  };

  const modeloCargado = TEMPLATES[categoria] !== null;

  return (
    <View {...swipeHandlers} style={[styles.contenedor, { backgroundColor: colors.background }]}>
      <AppHeader />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* En modo producto mostramos su nombre y un botón para volver.
            En modo libre mostramos el selector horizontal de categorías. */}
        {esModoProducto ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              hitSlop={10}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="arrow-back" size={18} color={colors.text} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>
                {producto?.name}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
                Personaliza tu {TEMPLATE_LABELS[categoria].toLowerCase()}
              </Text>
            </View>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtros}
          >
            {CATEGORIAS.map((cat) => {
              const activa = categoria === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setCategoria(cat)}
                  style={[styles.filtroBtn, activa && styles.filtroBtnActivo]}
                >
                  <Text
                    style={activa ? styles.filtroTextoActivo : styles.filtroTexto}
                  >
                    {TEMPLATE_LABELS[cat]}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        <View style={styles.visor}>
          <ModelViewer
            modelModule={TEMPLATES[categoria]}
            textureUri={textureUri}
          />
        </View>

        {!modeloCargado && (
          <View style={styles.notaModelo}>
            <Text style={styles.notaTexto}>
              Modo demo: se muestra un cubo porque aún no hay un .glb para esta
              categoría. Exporta el modelo desde Blender y colócalo en
              assets/models/.
            </Text>
          </View>
        )}

        <View style={styles.acciones}>
          <Pressable onPress={seleccionarImagen} style={styles.botonSecundario}>
            <Ionicons name="image-outline" size={20} color={COLORES.amarillo} />
            <Text style={styles.botonSecundarioTexto}>
              {textureUri ? 'Cambiar textura' : 'Añadir textura'}
            </Text>
          </Pressable>

          {textureUri && (
            <View style={styles.previewContenedor}>
              <Image source={{ uri: textureUri }} style={styles.previewImagen} />
              <View style={styles.previewTextos}>
                <Text style={styles.previewTitulo}>Textura seleccionada</Text>
                <Text style={styles.previewSub} numberOfLines={1}>
                  {textureUri.split('/').pop()}
                </Text>
              </View>
              <Pressable onPress={() => setTextureUri(null)} hitSlop={8}>
                <Ionicons name="close-circle" size={22} color={COLORES.suave} />
              </Pressable>
            </View>
          )}

          <Pressable
            onPress={enviarAlCarrito}
            style={({ pressed }) => [
              styles.botonPrincipal,
              pressed && styles.botonPrincipalPresionado,
            ]}
          >
            <Text style={styles.botonPrincipalTexto}>
              {confirmado ? 'Añadido al carrito' : 'Añadir al carrito'}
            </Text>
            <Ionicons
              name={confirmado ? 'checkmark-circle' : 'cart-outline'}
              size={20}
              color={COLORES.fondo}
            />
          </Pressable>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}
