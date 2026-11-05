import { Redirect } from 'expo-router';

// Al abrir la app, redirige al login.
// Cuando exista sesión persistida, aquí se decidirá /login o /panel.
export default function Index() {
  return <Redirect href="/login" />;
}
