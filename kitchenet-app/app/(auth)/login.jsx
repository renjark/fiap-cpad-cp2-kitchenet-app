import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS, SPACING, FONT, RADIUS } from '../../constants/theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const senhaRef = useRef(null);

  function validar() {
    const e = {};
    if (!email.trim()) e.email = 'O e-mail é obrigatório';
    else if (!EMAIL_REGEX.test(email.trim())) e.email = 'Formato de e-mail inválido';
    if (!senha) e.senha = 'A senha é obrigatória';
    else if (senha.length < 6) e.senha = 'A senha deve ter pelo menos 6 caracteres';
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    setApiError('');
    if (!validar()) return;
    setLoading(true);
    const result = await login({ email: email.trim(), password: senha });
    setLoading(false);
    if (!result.success) setApiError(result.error);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        
        <View style={styles.header}>
          <Text style={styles.logo}>🍽️</Text>
          <Text style={styles.brand}>Kitchenet</Text>
          <Text style={styles.subtitle}>FIAP · Sabor no andar certo</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Bem-vindo(a) de volta!</Text>
          <Text style={styles.desc}>Faça login para continuar</Text>

          {apiError ? (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>{apiError}</Text>
            </View>
          ) : null}

          <Input
            label="E-mail"
            icon="mail-outline"
            placeholder="seu@email.com"
            value={email}
            onChangeText={(v) => { setEmail(v); setErros((e) => ({ ...e, email: '' })); }}
            error={erros.email}
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => senhaRef.current?.focus()}
          />

          <Input
            label="Senha"
            icon="lock-closed-outline"
            placeholder="Mínimo 6 caracteres"
            value={senha}
            onChangeText={(v) => { setSenha(v); setErros((e) => ({ ...e, senha: '' })); }}
            error={erros.senha}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            ref={senhaRef}
          />

          <Button title="Entrar" onPress={handleLogin} loading={loading} style={{ marginTop: 8 }} />

          <TouchableOpacity onPress={() => router.push('/(auth)/cadastro')} style={styles.link}>
            <Text style={styles.linkText}>
              Não tem conta? <Text style={styles.linkHighlight}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    justifyContent: 'center',
  },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  logo: { fontSize: 56 },
  brand: {
    fontSize: 32,
    fontWeight: FONT.extraBold,
    color: COLORS.primary,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: FONT.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  desc: { fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  apiErrorBox: {
    backgroundColor: '#FFF0F0',
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.error,
  },
  apiErrorText: { color: COLORS.error, fontSize: 13 },
  link: { alignItems: 'center', marginTop: SPACING.lg },
  linkText: { fontSize: 14, color: COLORS.textSecondary },
  linkHighlight: { color: COLORS.primary, fontWeight: FONT.bold },
});
