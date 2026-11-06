import { useCallback, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../context/ThemeContext';
import { useProducts } from '../context/ProductsContext';
import { getUser, isAuthenticated, isAdmin, User } from '../lib/api';
import type { Product } from '../lib/types';
import { TEMPLATE_LABELS, TemplateCategory } from '../lib/templates';

type FormState = {
  name: string;
  description: string;
  price: string;
  image: string;
  template: TemplateCategory | '';
  badge: '' | 'nuevo' | 'oferta';
};

const FORM_VACIO: FormState = {
  name: '',
  description: '',
  price: '',
  image: '',
  template: '',
  badge: '',
};

const TEMPLATES_LIST: TemplateCategory[] = [
  'pullover',
  'gorra',
  'vaso',
  'pantalon',
  'short',
];

export default function AdminScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { products, loading, create, update, remove, reset } = useProducts();

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(FORM_VACIO);

  // Verificar rol admin
  useEffect(() => {
    (async () => {
      const u = await getUser();
      setUser(u);
      setChecking(false);
      const ok = u?.role === 'admin' || u?.role === 'debug';
      if (!ok) router.replace('/main?tab=home');
    })();
  }, [router]);

  const abrirNuevo = () => {
    setEditingId(null);
    setForm(FORM_VACIO);
    setModalVisible(true);
  };

  const abrirEditar = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? '',
      price: String(p.price),
      image: p.image ?? '',
      template: p.template ?? '',
      badge: p.badge ?? '',
    });
    setModalVisible(true);
  };

  const guardar = async () => {
    if (!form.name.trim()) {
      Alert.alert('Falta el nombre');
      return;
    }
    const price = parseFloat(form.price.replace(',', '.'));
    if (isNaN(price) || price < 0) {
      Alert.alert('Precio inválido');
      return;
    }

    const input: Omit<Product, 'id'> = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price,
      image: form.image.trim() || undefined,
      template: form.template || undefined,
      badge: form.badge || null,
    };

    if (editingId === null) {
      await create(input);
    } else {
      await update(editingId, input);
    }
    setModalVisible(false);
  };

  const borrar = (p: Product) => {
    Alert.alert(
      'Eliminar producto',
      `¿Seguro que quieres eliminar "${p.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => remove(p.id),
        },
      ]
    );
  };

  const restaurar = () => {
    Alert.alert(
      'Restaurar catálogo',
      'Se reemplazarán todos los cambios por los productos de ejemplo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Restaurar', style: 'destructive', onPress: () => reset() },
      ]
    );
  };

  if (checking) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader />

      {/* Cabecera del panel */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>
            Panel de admin
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
            {products.length} producto{products.length === 1 ? '' : 's'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={restaurar}
            hitSlop={8}
            style={{
              padding: 10,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="refresh-outline" size={18} color={colors.textMuted} />
          </Pressable>
          <Pressable
            onPress={abrirNuevo}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: colors.primary,
            }}
          >
            <Ionicons name="add" size={18} color={colors.background} />
            <Text style={{ color: colors.background, fontWeight: '700', fontSize: 13 }}>
              Nuevo
            </Text>
          </Pressable>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p) => String(p.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 10 }}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                borderRadius: 10,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 56, height: 56, borderRadius: 8 }}
                />
              ) : (
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    backgroundColor: colors.surfaceAlt,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="image-outline" size={22} color={colors.textMuted} />
                </View>
              )}
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14 }} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }} numberOfLines={1}>
                  ${item.price.toFixed(2)}
                  {item.template ? ` · ${TEMPLATE_LABELS[item.template]}` : ''}
                </Text>
              </View>

              {/* Personalizar en editor 3D */}
              <Pressable
                onPress={() => router.push(`/editor3d?productId=${item.id}`)}
                hitSlop={8}
                style={{ padding: 8 }}
              >
                <Ionicons name="cube-outline" size={20} color={colors.primary} />
              </Pressable>

              {/* Editar */}
              <Pressable onPress={() => abrirEditar(item)} hitSlop={8} style={{ padding: 8 }}>
                <Ionicons name="create-outline" size={20} color={colors.textMuted} />
              </Pressable>

              {/* Eliminar */}
              <Pressable onPress={() => borrar(item)} hitSlop={8} style={{ padding: 8 }}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 40 }}>
              No hay productos. Crea el primero con el botón "Nuevo".
            </Text>
          }
        />
      )}

      {/* Modal de crear/editar */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000aa',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: '90%',
              borderTopWidth: 1,
              borderColor: colors.border,
            }}
          >
            <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>
                  {editingId === null ? 'Nuevo producto' : 'Editar producto'}
                </Text>
                <Pressable onPress={() => setModalVisible(false)} hitSlop={8}>
                  <Ionicons name="close" size={22} color={colors.textMuted} />
                </Pressable>
              </View>

              {(['name', 'description', 'price', 'image'] as const).map((field) => (
                <View key={field}>
                  <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 4 }}>
                    {field === 'name'
                      ? 'Nombre'
                      : field === 'description'
                      ? 'Descripción'
                      : field === 'price'
                      ? 'Precio'
                      : 'URL de imagen'}
                  </Text>
                  <TextInput
                    value={form[field]}
                    onChangeText={(v) => setForm((f) => ({ ...f, [field]: v }))}
                    placeholder={
                      field === 'price' ? '0.00' : field === 'image' ? 'https://...' : ''
                    }
                    placeholderTextColor={colors.textMuted}
                    keyboardType={field === 'price' ? 'decimal-pad' : 'default'}
                    multiline={field === 'description'}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 8,
                      padding: 12,
                      color: colors.text,
                      backgroundColor: colors.surface,
                      minHeight: field === 'description' ? 70 : undefined,
                      textAlignVertical: field === 'description' ? 'top' : 'center',
                    }}
                  />
                </View>
              ))}

              {/* Selector de plantilla 3D */}
              <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>
                Plantilla 3D
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <Pressable
                  onPress={() => setForm((f) => ({ ...f, template: '' }))}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor:
                      form.template === '' ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: form.template === '' ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    style={{
                      color: form.template === '' ? colors.background : colors.textMuted,
                      fontSize: 12,
                      fontWeight: '600',
                    }}
                  >
                    Ninguna
                  </Text>
                </Pressable>
                {TEMPLATES_LIST.map((t) => {
                  const activo = form.template === t;
                  return (
                    <Pressable
                      key={t}
                      onPress={() => setForm((f) => ({ ...f, template: t }))}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor: activo ? colors.primary : colors.surface,
                        borderWidth: 1,
                        borderColor: activo ? colors.primary : colors.border,
                      }}
                    >
                      <Text
                        style={{
                          color: activo ? colors.background : colors.textMuted,
                          fontSize: 12,
                          fontWeight: '600',
                        }}
                      >
                        {TEMPLATE_LABELS[t]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Badge */}
              <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>
                Etiqueta
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(['', 'nuevo', 'oferta'] as const).map((b) => {
                  const activo = form.badge === b;
                  const label = b === '' ? 'Ninguna' : b === 'nuevo' ? 'Nuevo' : 'Oferta';
                  return (
                    <Pressable
                      key={b || 'none'}
                      onPress={() => setForm((f) => ({ ...f, badge: b }))}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: activo ? colors.primary : colors.surface,
                        borderWidth: 1,
                        borderColor: activo ? colors.primary : colors.border,
                      }}
                    >
                      <Text
                        style={{
                          color: activo ? colors.background : colors.textMuted,
                          fontSize: 12,
                          fontWeight: '600',
                        }}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                onPress={guardar}
                style={{
                  marginTop: 8,
                  backgroundColor: colors.primary,
                  borderRadius: 10,
                  padding: 14,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.background, fontWeight: '700', fontSize: 14 }}>
                  {editingId === null ? 'Crear producto' : 'Guardar cambios'}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <BottomNav />
    </View>
  );
}
