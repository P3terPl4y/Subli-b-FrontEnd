import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../context/ThemeContext';
import { getUser, logout, User } from '../lib/api';
import { storage } from '../lib/storage';
import {
  PaymentMethod,
  addPayment,
  listPayments,
  removePayment,
  setDefaultPayment,
} from '../lib/payments';

type Tab = 'datos' | 'pagos' | 'apariencia' | 'seguridad';

const TABS: { key: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'datos', label: 'Datos', icon: 'person-outline' },
  { key: 'pagos', label: 'Pagos', icon: 'card-outline' },
  { key: 'apariencia', label: 'Apariencia', icon: 'color-palette-outline' },
  { key: 'seguridad', label: 'Seguridad', icon: 'lock-closed-outline' },
];

const USER_KEY = 'subli_b_user';

export default function SettingsScreen() {
  const router = useRouter();
  const { mode, colors, setMode } = useTheme();
  const [tab, setTab] = useState<Tab>('datos');

  // --- Datos ---
  const [user, setUser] = useState<User | null>(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [guardandoDatos, setGuardandoDatos] = useState(false);
  const [okDatos, setOkDatos] = useState('');

  // --- Pagos ---
  const [pagos, setPagos] = useState<PaymentMethod[]>([]);
  const [nuevoTipo, setNuevoTipo] = useState<'card' | 'paypal'>('card');
  const [nuevoLabel, setNuevoLabel] = useState('');
  const [nuevoLast4, setNuevoLast4] = useState('');

  // --- Seguridad ---
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [errPass, setErrPass] = useState('');
  const [okPass, setOkPass] = useState('');

  useEffect(() => {
    (async () => {
      const u = await getUser();
      setUser(u);
      setNombre(u?.name || '');
      setEmail(u?.email || '');
      const raw = await storage.get('subli_phone');
      setTelefono(raw || '');
      setPagos(await listPayments());
    })();
  }, []);

  const guardarDatos = async () => {
    if (!nombre.trim() || !email.trim()) return;
    setGuardandoDatos(true);
    const nextUser: User = {
      id: user?.id ?? 'local',
      name: nombre.trim(),
      email: email.trim(),
      role: user?.role,
    };
    await storage.set(USER_KEY, JSON.stringify(nextUser));
    await storage.set('subli_phone', telefono.trim());
    setUser(nextUser);
    setGuardandoDatos(false);
    setOkDatos('Datos guardados');
    setTimeout(() => setOkDatos(''), 2000);
  };

  const agregarPago = async () => {
    if (!nuevoLabel.trim()) return;
    const next = await addPayment({
      type: nuevoTipo,
      label: nuevoLabel.trim(),
      last4: nuevoTipo === 'card' ? nuevoLast4.slice(-4) : undefined,
    });
    setPagos(next);
    setNuevoLabel('');
    setNuevoLast4('');
  };

  const borrarPago = async (id: string) => {
    setPagos(await removePayment(id));
  };

  const marcarDefault = async (id: string) => {
    setPagos(await setDefaultPayment(id));
  };

  const cambiarPass = () => {
    setErrPass('');
    setOkPass('');
    if (!actual || !nueva || !confirmar) {
      setErrPass('Completa los tres campos.');
      return;
    }
    if (nueva.length < 6) {
      setErrPass('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (nueva !== confirmar) {
      setErrPass('Las contraseñas no coinciden.');
      return;
    }
    // TODO: llamar al backend /api/auth/change-password cuando exista
    setOkPass('Contraseña actualizada (simulado).');
    setActual('');
    setNueva('');
    setConfirmar('');
  };

  const salir = async () => {
    await logout();
    router.replace('/main?tab=home');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader />

      {/* Tabs superiores */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
      >
        {TABS.map((t) => {
          const activo = tab === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: activo ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: activo ? colors.primary : colors.border,
                marginRight: 8,
              }}
            >
              <Ionicons
                name={t.icon}
                size={16}
                color={activo ? colors.background : colors.textMuted}
              />
              <Text
                style={{
                  color: activo ? colors.background : colors.textMuted,
                  fontSize: 13,
                  fontWeight: activo ? '700' : '500',
                }}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 14 }}>
        {/* ============ DATOS ============ */}
        {tab === 'datos' && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
              gap: 12,
            }}
          >
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>
              Datos personales
            </Text>

            <Text style={{ color: colors.textMuted, fontSize: 12 }}>Nombre</Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Tu nombre"
              placeholderTextColor={colors.textMuted}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                color: colors.text,
                backgroundColor: colors.background,
              }}
            />

            <Text style={{ color: colors.textMuted, fontSize: 12 }}>Correo</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="tu@correo.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                color: colors.text,
                backgroundColor: colors.background,
              }}
            />

            <Text style={{ color: colors.textMuted, fontSize: 12 }}>Teléfono</Text>
            <TextInput
              value={telefono}
              onChangeText={setTelefono}
              placeholder="+53 ..."
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                color: colors.text,
                backgroundColor: colors.background,
              }}
            />

            <Pressable
              onPress={guardarDatos}
              disabled={guardandoDatos}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 8,
                padding: 14,
                alignItems: 'center',
                marginTop: 6,
              }}
            >
              {guardandoDatos ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={{ color: colors.background, fontWeight: '700' }}>
                  Guardar cambios
                </Text>
              )}
            </Pressable>
            {okDatos ? (
              <Text style={{ color: colors.success, fontSize: 12 }}>{okDatos}</Text>
            ) : null}
          </View>
        )}

        {/* ============ PAGOS ============ */}
        {tab === 'pagos' && (
          <>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 16,
                gap: 10,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>
                Métodos guardados
              </Text>

              {pagos.length === 0 && (
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                  Aún no tienes métodos de pago.
                </Text>
              )}

              {pagos.map((p) => (
                <View
                  key={p.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: p.isDefault ? colors.primary : colors.border,
                  }}
                >
                  <Ionicons
                    name={p.type === 'card' ? 'card' : 'logo-paypal'}
                    size={22}
                    color={colors.primary}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: '600', fontSize: 13 }}>
                      {p.label}
                      {p.last4 ? ` •••• ${p.last4}` : ''}
                    </Text>
                    <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                      {p.isDefault ? 'Predeterminado' : 'Secundario'}
                    </Text>
                  </View>
                  {!p.isDefault && (
                    <Pressable onPress={() => marcarDefault(p.id)} hitSlop={8}>
                      <Ionicons name="star-outline" size={20} color={colors.textMuted} />
                    </Pressable>
                  )}
                  <Pressable onPress={() => borrarPago(p.id)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                  </Pressable>
                </View>
              ))}
            </View>

            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 16,
                gap: 10,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>
                Añadir método
              </Text>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(['card', 'paypal'] as const).map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setNuevoTipo(t)}
                    style={{
                      flex: 1,
                      padding: 10,
                      borderRadius: 8,
                      alignItems: 'center',
                      backgroundColor:
                        nuevoTipo === t ? colors.primary : colors.background,
                      borderWidth: 1,
                      borderColor: nuevoTipo === t ? colors.primary : colors.border,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          nuevoTipo === t ? colors.background : colors.textMuted,
                        fontWeight: '600',
                        fontSize: 12,
                      }}
                    >
                      {t === 'card' ? 'Tarjeta' : 'PayPal'}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <TextInput
                value={nuevoLabel}
                onChangeText={setNuevoLabel}
                placeholder={nuevoTipo === 'card' ? 'Visa personal' : 'mi@paypal.com'}
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  padding: 12,
                  color: colors.text,
                  backgroundColor: colors.background,
                }}
              />

              {nuevoTipo === 'card' && (
                <TextInput
                  value={nuevoLast4}
                  onChangeText={setNuevoLast4}
                  placeholder="Últimos 4 dígitos"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={4}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    padding: 12,
                    color: colors.text,
                    backgroundColor: colors.background,
                  }}
                />
              )}

              <Pressable
                onPress={agregarPago}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                  padding: 14,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.background, fontWeight: '700' }}>
                  Añadir
                </Text>
              </Pressable>
            </View>
          </>
        )}

        {/* ============ APARIENCIA ============ */}
        {tab === 'apariencia' && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
              gap: 14,
            }}
          >
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>
              Apariencia
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 8,
              }}
            >
              <View>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                  Modo oscuro
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                  Actívalo para fondos oscuros
                </Text>
              </View>
              <Switch
                value={mode === 'dark'}
                onValueChange={(v) => setMode(v ? 'dark' : 'light')}
                trackColor={{ false: colors.surfaceAlt, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                marginTop: 6,
              }}
            >
              {(['light', 'dark'] as const).map((m) => (
                <Pressable
                  key={m}
                  onPress={() => setMode(m)}
                  style={{
                    flex: 1,
                    padding: 14,
                    borderRadius: 10,
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: m === 'dark' ? '#0b0b0c' : '#f5f5f7',
                    borderWidth: 2,
                    borderColor: mode === m ? colors.primary : colors.border,
                  }}
                >
                  <Ionicons
                    name={m === 'dark' ? 'moon' : 'sunny'}
                    size={22}
                    color={m === 'dark' ? '#fafafa' : '#0b0b0c'}
                  />
                  <Text
                    style={{
                      color: m === 'dark' ? '#fafafa' : '#0b0b0c',
                      fontSize: 12,
                      fontWeight: '600',
                    }}
                  >
                    {m === 'dark' ? 'Oscuro' : 'Claro'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* ============ SEGURIDAD ============ */}
        {tab === 'seguridad' && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
              gap: 12,
            }}
          >
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>
              Cambiar contraseña
            </Text>

            {(['actual', 'nueva', 'confirmar'] as const).map((campo) => (
              <View key={campo}>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 4 }}>
                  {campo === 'actual'
                    ? 'Contraseña actual'
                    : campo === 'nueva'
                    ? 'Nueva contraseña'
                    : 'Confirmar contraseña'}
                </Text>
                <TextInput
                  value={
                    campo === 'actual' ? actual : campo === 'nueva' ? nueva : confirmar
                  }
                  onChangeText={(v) =>
                    campo === 'actual'
                      ? setActual(v)
                      : campo === 'nueva'
                      ? setNueva(v)
                      : setConfirmar(v)
                  }
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    padding: 12,
                    color: colors.text,
                    backgroundColor: colors.background,
                  }}
                />
              </View>
            ))}

            {errPass ? (
              <Text style={{ color: colors.danger, fontSize: 12 }}>{errPass}</Text>
            ) : null}
            {okPass ? (
              <Text style={{ color: colors.success, fontSize: 12 }}>{okPass}</Text>
            ) : null}

            <Pressable
              onPress={cambiarPass}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 8,
                padding: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.background, fontWeight: '700' }}>
                Actualizar contraseña
              </Text>
            </Pressable>

            <Pressable
              onPress={salir}
              style={{
                marginTop: 12,
                padding: 14,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.danger,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.danger, fontWeight: '700' }}>
                Cerrar sesión
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <BottomNav />
    </View>
  );
}
