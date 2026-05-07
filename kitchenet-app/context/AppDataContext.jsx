import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const AppDataContext = createContext(null);

const STORAGE_KEYS = {
  FAVORITES: (userId) => `@kitchenet:favorites:${userId}`,
  CART: (userId) => `@kitchenet:cart:${userId}`,
};

export function AppDataProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Carrega dados do usuário logado
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setFavorites([]);
      setCart([]);
    }
  }, [user]);

  async function loadUserData() {
    if (!user) return;
    setLoadingData(true);
    try {
      const [favJson, cartJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FAVORITES(user.id)),
        AsyncStorage.getItem(STORAGE_KEYS.CART(user.id)),
      ]);
      setFavorites(favJson ? JSON.parse(favJson) : []);
      setCart(cartJson ? JSON.parse(cartJson) : []);
    } catch (e) {
      console.error('Erro ao carregar dados do app:', e);
    } finally {
      setLoadingData(false);
    }
  }

  // Favoritos
  async function toggleFavorite(item) {
    if (!user) return;
    const isFav = favorites.some((f) => f.id === item.id);
    const updated = isFav
      ? favorites.filter((f) => f.id !== item.id)
      : [...favorites, item];
    setFavorites(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES(user.id), JSON.stringify(updated));
  }

  function isFavorite(itemId) {
    return favorites.some((f) => f.id === itemId);
  }

  // Carrinho
  async function addToCart(item) {
    if (!user) return;
    const existing = cart.find((c) => c.id === item.id);
    let updated;
    if (existing) {
      updated = cart.map((c) =>
        c.id === item.id ? { ...c, qty: c.qty + 1 } : c
      );
    } else {
      updated = [...cart, { ...item, qty: 1 }];
    }
    setCart(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.CART(user.id), JSON.stringify(updated));
  }

  async function removeFromCart(itemId) {
    if (!user) return;
    const updated = cart.filter((c) => c.id !== itemId);
    setCart(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.CART(user.id), JSON.stringify(updated));
  }

  async function updateQty(itemId, qty) {
    if (!user) return;
    if (qty <= 0) return removeFromCart(itemId);
    const updated = cart.map((c) => (c.id === itemId ? { ...c, qty } : c));
    setCart(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.CART(user.id), JSON.stringify(updated));
  }

  async function clearCart() {
    if (!user) return;
    setCart([]);
    await AsyncStorage.removeItem(STORAGE_KEYS.CART(user.id));
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.priceNum * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <AppDataContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        cart,
        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        loadingData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData deve ser usado dentro de AppDataProvider');
  return ctx;
}
