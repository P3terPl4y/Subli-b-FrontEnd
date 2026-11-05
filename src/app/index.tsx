import { Redirect } from 'expo-router';

// La app siempre arranca en el home, con o sin sesión.
// Las acciones sensibles (añadir al carrito) verifican autenticación
// en el momento, no al entrar.
export default function Index() {
  return <Redirect href="/home" />;
}
