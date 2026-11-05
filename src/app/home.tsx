import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { apiFetch } from '../lib/api';
import { COLORES, styles } from '../styles/home.styles';
import ProductCard from '../components/ProductCard';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import { useGuardedCart } from '../hooks/useGuardedCart';
import type { Product } from '../lib/types';
import productsMock from '../data/products.json';

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';
const BREAKPOINT = 700;

export default function HomeScreen() {
  const { tryAdd } = useGuardedCart();
  const { width } = useWindowDimensions();
  const numColumns = width >= BREAKPOINT ? 4 : 2;

  const [products, setProducts] = useState<Product[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const p: Product[] = USE_MOCK
          ? (productsMock as Product[])
          : await apiFetch<Product[]>('/api/products');
        if (!mounted) return;
        setProducts(p);
      } catch (e: any) {
        if (mounted) setError(e.message || 'No se pudo cargar el catálogo');
      } finally {
        if (mounted) setCargando(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator color={COLORES.amarillo} size="large" />
      </View>
    );
  }

  const displayData: Array<Product | { __placeholder: true; id: string }> = [
    ...products,
  ];
  while (displayData.length % numColumns !== 0) {
    displayData.push({ __placeholder: true, id: `ph-${displayData.length}` });
  }

  return (
    <View style={styles.contenedor}>
      <AppHeader />

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
                  tryAdd({ kind: 'product', label: item.name })
                }
              />
            );
          }}
          ListEmptyComponent={
            <Text style={styles.vacio}>Aún no hay productos en el catálogo.</Text>
          }
        />
      )}

      <BottomNav />
    </View>
  );
}
