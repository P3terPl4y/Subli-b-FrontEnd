import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';
import { isAuthenticated } from '../lib/api';

// Envuelve el carrito: si el usuario no esta autenticado,
// redirige a login en lugar de anadir el item.
// Devuelve true si se anadio, false si hubo redireccion.
export function useGuardedCart() {
  const router = useRouter();
  const cart = useCart();

  const tryAdd: typeof cart.add = async (item) => {
    const authed = await isAuthenticated();
    if (!authed) {
      router.push('/login');
      return;
    }
    cart.add(item);
  };

  return { ...cart, tryAdd };
}
