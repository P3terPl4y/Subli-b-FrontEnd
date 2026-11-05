import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { isAuthenticated } from '../lib/api';

export default function Index() {
  const [estado, setEstado] = useState<'checking' | 'auth' | 'guest'>('checking');
  useEffect(() => {
    isAuthenticated().then((ok) => setEstado(ok ? 'auth' : 'guest'));
  }, []);
  if (estado === 'checking') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0b0b0c', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#ffd500" />
      </View>
    );
  }
  return <Redirect href={estado === 'auth' ? '/home' : '/login'} />;
}
