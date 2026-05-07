import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  USERS: '@kitchenet:users',
  SESSION: '@kitchenet:session',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica sessão persistida ao abrir o app
  useEffect(() => {
    async function loadSession() {
      try {
        const sessionJson = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
        if (sessionJson) {
          const session = JSON.parse(sessionJson);
          setUser(session);
        }
      } catch (e) {
        console.error('Erro ao carregar sessão:', e);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  // Cadastro: salva usuário no AsyncStorage
  async function register({ name, email, password }) {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Verifica se email já existe
      const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return { success: false, error: 'Este e-mail já está cadastrado.' };
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email: email.toLowerCase(),
        password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      // Loga automaticamente após cadastro
      const session = { id: newUser.id, name: newUser.name, email: newUser.email };
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      setUser(session);

      return { success: true };
    } catch (e) {
      console.error('Erro no cadastro:', e);
      return { success: false, error: 'Erro ao cadastrar. Tente novamente.' };
    }
  }

  // Login: valida credenciais contra AsyncStorage
  async function login({ email, password }) {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users = usersJson ? JSON.parse(usersJson) : [];

      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!found) {
        return { success: false, error: 'E-mail ou senha incorretos.' };
      }

      const session = { id: found.id, name: found.name, email: found.email };
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      setUser(session);

      return { success: true };
    } catch (e) {
      console.error('Erro no login:', e);
      return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
    }
  }

  // Logout: limpa sessão
  async function logout() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
      setUser(null);
    } catch (e) {
      console.error('Erro no logout:', e);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
