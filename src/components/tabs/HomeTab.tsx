import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  Platform,
  Text,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';
import { apiFetch } from '../../lib/api';
import { COLORES, styles } from '../../styles/home.styles';
import ProductCard from '../../components/ProductCard';
import { useGuardedCart } from '../../hooks/useGuardedCart';
import { useTabNavigation } from '../../context/TabNavigationContext';
import { useSelectedProduct } from '../../context/SelectedProductContext';
import { useTheme } from '../../context/ThemeContext';
import { useProducts } from '../../context/ProductsContext';
import type { Product } from '../../lib/types';

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';
const BREAKPOINT = 700;

// En Android hay que habilitar LayoutAnimation manualmente
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {
  const { tryAdd } = useGuardedCart();
  const { goToTab } = useTabNavigation();
  const { select } = useSelectedProduct();
  const { colors } = useTheme();
  const { products: localProducts, loading } = useProducts();
  const { width } = useWindowDimensions();
  const numColumns = width >= BREAKPOINT ? 4 : 2;

  const [backendProducts, setBackendProducts] = useState<Product[]>([]);
  const [cargandoBackend, setCargandoBackend] = useState(!USE_MOCK);
  const [error, setError] = useState<string | null>(null);

  // En modo real (no mock), carga los productos del backend
  useEffect(() => {
    if (USE_MOCK) return;
    let mounted = true;
    (async () => {
      try {
        const p = await apiFetch<Product[]>('/api/products');
        if (mounted) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setBackendProducts(p);
      } catch (e: any) {
        if (mounted) setError(e.message || 'No se pudo cargar el catálogo');
      } finally {
        if (mounted) setCargandoBackend(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading || cargandoBackend) {
    return (
      <View style={[styles.centrado, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={COLORES.amarillo} size="large" />
      </View>
    );
  }

  const products = USE_MOCK ? localProducts : backendProducts;

  const displayData: Array<Product | { __placeholder: true; id: string }> = [
    ...products,
  ];
  while (displayData.length % numColumns !== 0) {
    displayData.push({ __placeholder: true, id: `ph-${displayData.length}` });
  }

  return (
    <View style={[styles.contenedor, { backgroundColor: colors.background }]}>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTexto}>{error}</Text>
        </View>
      ) : (
        <FlatList
          key={numColumns}
          data={displayData}
          keyExtractor={(p) => String(p.id)}
          numColumns={numColumns}
          columnWrapperStyle={styles.fila}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => {
            if ('__placeholder' in item) {
              return <View style={{ flex: 1 }} />;
            }
            return (
              <ProductCard
                product={item}
                onAdd={() =>
                  tryAdd({
                    kind: 'product',
                    label: item.name,
                    price: item.price,
                    productId: item.id,
                  })
                }
                onPress={() => { select(item); goToTab('editor3d'); }}
              />
            );
          }}
          ListEmptyComponent={
            <Text style={[styles.vacio, { color: colors.textMuted }]}>
              Aún no hay productos en el catálogo.
            </Text>
          }
        />
      )}

      </View>
  );
}
