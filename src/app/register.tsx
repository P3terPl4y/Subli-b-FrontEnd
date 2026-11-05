import { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Barlow_400Regular,
  Barlow_500Medium,
  Barlow_600SemiBold,
  Barlow_700Bold,
  useFonts,
} from '@expo-google-fonts/barlow';
import { COLORES, styles } from '../styles/login.styles';

export default function RegisterScreen() {
  const router = useRouter();
  const [fuentesListas] = useFonts({
    Barlow_400Regular,
    Barlow_500Medium,
    Barlow_600SemiBold,
    Barlow_700Bold,
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  if (!fuentesListas) return <View style={styles.pantallaCarga} />;

  const enviar = async () => {
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Completa todos los campos.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('El correo no tiene un formato válido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true);
    // TODO: sustituir por apiFetch('/api/auth/register', {...}) cuando exista el backend
    setTimeout(() => {
      setCargando(false);
      router.replace('/login');
    }, 800);
  };

  return (
    <View style={styles.contenedor}>
      <StatusBar style="light" />
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
            <View style={styles.bandaTricolor}>
              <View style={[styles.segmento, { backgroundColor: '#ed1c24' }]} />
              <View style={[styles.segmento, { backgroundColor: COLORES.amarillo }]} />
              <View style={[styles.segmento, { backgroundColor: COLORES.azul }]} />
            </View>

            <View style={styles.cabecera}>
              <Image
                source={require('../../assets/logo/LOGO.png')}
                style={styles.logoImagen}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.marcaNombre}>Subli-b</Text>
                <Text style={styles.marcaSub}>Crear cuenta</Text>
              </View>
            </View>

            <Text style={styles.titulo}>
              Únete a <Text style={styles.tituloAcento}>Subli-b</Text>
            </Text>
            <Text style={styles.subtitulo}>
              Crea tu cuenta para personalizar productos y guardar tu carrito.
            </Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              placeholderTextColor={COLORES.textoSuaveInput}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="tu@correo.com"
              placeholderTextColor={COLORES.textoSuaveInput}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputContenedor}>
              <TextInput
                style={styles.inputPassword}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={COLORES.textoSuaveInput}
                secureTextEntry={!mostrar}
              />
              <Pressable
                onPress={() => setMostrar((v) => !v)}
                hitSlop={8}
                style={styles.togglePass}
              >
                <Ionicons
                  name={mostrar ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORES.suave}
                />
              </Pressable>
            </View>

            {error ? (
              <View style={[styles.mensaje, styles.mensajeError]}>
                <Text style={[styles.mensajeTexto, styles.mensajeTextoError]}>
                  {error}
                </Text>
              </View>
            ) : null}

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
                  <Text style={styles.botonTexto}>Crear cuenta</Text>
                  <Ionicons name="arrow-forward" size={16} color={COLORES.fondo} />
                </>
              )}
            </Pressable>

            <Text style={styles.pie}>
              ¿Ya tienes cuenta?{' '}
              <Text
                style={styles.pieEnlace}
                onPress={() => router.replace('/login')}
              >
                Inicia sesión
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
