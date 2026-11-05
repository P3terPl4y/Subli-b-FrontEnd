import { useState } from 'react';
import { login as apiLogin, loginDebug } from '../lib/api';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import {
  Barlow_400Regular,
  Barlow_500Medium,
  Barlow_600SemiBold,
  Barlow_700Bold,
  useFonts,
} from '@expo-google-fonts/barlow';
import { COLORES, styles } from '../styles/login.styles';

// Credenciales de demostración
const DEMO = {
  email: 'admin@subli-b.com',
  password: 'admin123',
};

type TipoMensaje = 'error' | 'exito' | null;

export default function LoginScreen() {
  const router = useRouter();

  const [fuentesListas] = useFonts({
    Barlow_400Regular,
    Barlow_500Medium,
    Barlow_600SemiBold,
    Barlow_700Bold,
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recordar, setRecordar] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: TipoMensaje; texto: string }>({
    tipo: null,
    texto: '',
  });

  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  if (!fuentesListas) {
    return <View style={styles.pantallaCarga} />;
  }

  // Valida los campos y simula la autenticación
  const enviar = async () => {
    setMensaje({ tipo: null, texto: '' });
    const mail = email.trim();
  
    if (!mail || !password) {
      setMensaje({ tipo: 'error', texto: 'Completa correo y contraseña.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setMensaje({ tipo: 'error', texto: 'El correo no tiene un formato válido.' });
      return;
    }
  
    setCargando(true);
    try {
      await apiLogin(mail, password);
      setMensaje({ tipo: 'exito', texto: 'Acceso concedido. Redirigiendo...' });
      router.replace('/home');
    } catch (e: any) {
      setMensaje({ tipo: 'error', texto: e.message || 'No se pudo iniciar sesión' });
      setPassword('');
    } finally {
      setCargando(false);
    }
  };

  // Solo en desarrollo: crea una sesion falsa y va al home
  const entrarDebug = async () => {
    try {
      await loginDebug();
      router.replace('/home');
    } catch (e: any) {
      setMensaje({ tipo: 'error', texto: e.message });
    }
  };

  return (
    <View style={styles.contenedor}>
      <StatusBar style="light" />

      {/* Fondo con degradado aproximado al radial del diseño web */}
      <LinearGradient
        colors={['#0c1523', '#0b1019', COLORES.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View style={styles.haloAzul} pointerEvents="none" />
      <View style={styles.haloAmarillo} pointerEvents="none" />

      <KeyboardAvoidingView
        style={styles.teclado}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.tarjeta}>
            {/* Banda tricolor superior */}
            <View style={styles.bandaTricolor}>
              <View style={[styles.segmento, { backgroundColor: '#ed1c24' }]} />
              <View style={[styles.segmento, { backgroundColor: COLORES.amarillo }]} />
              <View style={[styles.segmento, { backgroundColor: COLORES.azul }]} />
            </View>

            {/* Cabecera con logo */}
            <View style={styles.cabecera}>
              <Image
                source={require('../../assets/logo/LOGO.png')}
                style={styles.logoImagen}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.marcaNombre}>Subli-b</Text>
                <Text style={styles.marcaSub}>Panel de administración</Text>
              </View>
            </View>

            {/* Píldora de estado */}
            <View style={styles.etiquetaEstado}>
              <View style={styles.puntoVerde} />
              <Text style={styles.etiquetaTexto}>Sistema operativo</Text>
            </View>

            <Text style={styles.titulo}>
              Bienvenido <Text style={styles.tituloAcento}>de vuelta</Text>
            </Text>
            <Text style={styles.subtitulo}>
              Inicia sesión para gestionar pedidos, catálogo y cotizaciones.
            </Text>

            {/* Campo de correo */}
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={[styles.input, emailFocus && styles.inputFocus]}
              value={email}
              onChangeText={setEmail}
              placeholder="tu@correo.com"
              placeholderTextColor={COLORES.textoSuaveInput}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />

            {/* Campo de contraseña con toggle */}
            <Text style={styles.label}>Contraseña</Text>
            <View style={[styles.inputContenedor, passwordFocus && styles.inputFocus]}>
              <TextInput
                style={styles.inputPassword}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={COLORES.textoSuaveInput}
                secureTextEntry={!mostrarPassword}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
              <Pressable
                onPress={() => setMostrarPassword((v) => !v)}
                hitSlop={8}
                style={styles.togglePass}
              >
                <Ionicons
                  name={mostrarPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORES.suave}
                />
              </Pressable>
            </View>

            {/* Fila de opciones */}
            <View style={styles.filaOpciones}>
              <Pressable onPress={() => setRecordar((v) => !v)} style={styles.casilla}>
                <View style={[styles.checkbox, recordar && styles.checkboxActivo]}>
                  {recordar && <Ionicons name="checkmark" size={11} color={COLORES.fondo} />}
                </View>
                <Text style={styles.casillaTexto}>Recordarme</Text>
              </Pressable>
              <Pressable>
                <Text style={styles.enlaceSuave}>¿Olvidaste tu contraseña?</Text>
              </Pressable>
            </View>

            {/* Botón de envío */}
            <Pressable
              onPress={enviar}
              disabled={cargando}
              style={({ pressed }) => [
                styles.boton,
                pressed && !cargando && styles.botonPresionado,
                cargando && styles.botonDeshabilitado,
              ]}
            >
              {cargando ? (
                <ActivityIndicator color={COLORES.fondo} />
              ) : (
                <>
                  <Text style={styles.botonTexto}>Iniciar sesión</Text>
                  <Ionicons name="arrow-forward" size={16} color={COLORES.fondo} />
                </>
              )}
            </Pressable>

            {/* Mensaje de error o éxito */}
            {mensaje.tipo && (
              <View
                style={[
                  styles.mensaje,
                  mensaje.tipo === 'error' ? styles.mensajeError : styles.mensajeExito,
                ]}
              >
                <Text
                  style={[
                    styles.mensajeTexto,
                    mensaje.tipo === 'error'
                      ? styles.mensajeTextoError
                      : styles.mensajeTextoExito,
                  ]}
                >
                  {mensaje.texto}
                </Text>
              </View>
            )}

            {/* Caja con credenciales demo */}
            <View style={styles.cajaDemo}>
              <Text style={styles.cajaDemoTexto}>
                <Text style={styles.cajaDemoStrong}>Demo</Text> · usa{' '}
                <Text style={styles.cajaDemoCode}>{DEMO.email}</Text> y{' '}
                <Text style={styles.cajaDemoCode}>{DEMO.password}</Text>
              </Text>
            </View>


            {/* Solo aparece en desarrollo. En produccion __DEV__ es false y no se renderiza */}
            {__DEV__ && (
              <Pressable onPress={entrarDebug} style={{ marginTop: 14, alignItems: 'center' }}>
                <Text style={{ color: '#aaa9ad', fontSize: 12, textDecorationLine: 'underline' }}>
                  Entrar sin contraseña (modo debug)
                </Text>
              </Pressable>
            )}

            <Text style={styles.pie}>

              ¿Aún no tienes cuenta?{' '}
              <Text style={styles.pieEnlace} onPress={() => router.replace('/register')}>Crear cuenta</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}