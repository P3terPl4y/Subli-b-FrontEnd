import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import ModelViewer from '../components/ModelViewer';
import { useGuardedCart } from '../hooks/useGuardedCart';
import {
  TEMPLATES,
  TEMPLATE_LABELS,
  TemplateCategory,
} from '../lib/templates';
import { COLORES, styles } from '../styles/editor3d.styles';

const CATEGORIAS: TemplateCategory[] = [
  'pullover',
  'gorra',
  'vaso',
  'pantalon',
  'short',
];

export default function Editor3DScreen() {
  const { tryAdd } = useGuardedCart();
  const [categoria, setCategoria] = useState<TemplateCategory>('pullover');
  const [textureUri, setTextureUri] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState(false);

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
    // tryAdd redirige a /login si no hay sesion, o anade si la hay
    await tryAdd({
      kind: 'custom',
      label: TEMPLATE_LABELS[categoria],
      textureUri,
    });
    setConfirmado(true);
    setTimeout(() => setConfirmado(false), 2000);
  };

  const modeloCargado = TEMPLATES[categoria] !== null;

  return (
    <View style={styles.contenedor}>
      <AppHeader />

      <ScrollView contentContainerStyle={styles.scroll}>
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
