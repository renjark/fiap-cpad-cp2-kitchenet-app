import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS, SPACING, FONT, RADIUS } from '../../constants/theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatarTelefone = (v) =>
  v.replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})/, '$1-$2')
    .slice(0, 15);

export default function Cadastro() {
  const router = useRouter();
  const { register } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const emailRef = useRef(null);
  const telRef = useRef(null);
  const senhaRef = useRef(null);
  const confirmRef = useRef(null);

  function validar() {
    const e = {};
    if (!nome.trim()) e.nome = 'O nome é obrigatório';
    else if (nome.trim().split(' ').length < 2) e.nome = 'Informe nome e sobrenome';
    if (!email.trim()) e.email = 'O e-mail é obrigatório';
    else if (!EMAIL_REGEX.test(email.trim())) e.email = 'Formato de e-mail inválido';
    if (!senha) e.senha = 'A senha é obrigatória';
    else if (senha.length < 6) e.senha = 'A senha deve ter pelo menos 6 caracteres';
    if (!confirmaSenha) e.confirmaSenha = 'Confirme sua senha';
    else if (senha !== confirmaSenha) e.confirmaSenha = 'As senhas não coincidem';
    setErros(e);
    return Object.keys(e).length === 0;
  }

  function clearError(field) {
    setErros((e) => ({ ...e, [field]: '' }));
  }

  async function handleCadastro() {
    setApiError('');
    if (!validar()) return;
    setLoading(true);
    const result = await register({ name: nome.trim(), email: email.trim(), password: senha });
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.desc}>Preencha os dados para se cadastrar</Text>
        </View>

        <View style={styles.card}>
          {apiError ? (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>{apiError}</Text>
            </View>
          ) : null}

          <Input
            label="Nome completo *"
            icon="person-outline"
            placeholder="Ex: Maria Silva"
            value={nome}
            onChangeText={(v) => { setNome(v); clearError('nome'); }}
            error={erros.nome}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />

          <Input
            label="E-mail *"
            icon="mail-outline"
            placeholder="seu@email.com"
            value={email}
            onChangeText={(v) => { setEmail(v); clearError('email'); }}
            error={erros.email}
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => telRef.current?.focus()}
            ref={emailRef}
          />

          <Input
            label="Telefone (opcional)"
            icon="call-outline"
            placeholder="(11) 99999-9999"
            value={telefone}
            onChangeText={(v) => setTelefone(formatarTelefone(v))}
            keyboardType="phone-pad"
            maxLength={15}
            returnKeyType="next"
            onSubmitEditing={() => senhaRef.current?.focus()}
            ref={telRef}
          />

          <Input
            label="Senha *"
            icon="lock-closed-outline"
            placeholder="Mínimo 6 caracteres"
            value={senha}
            onChangeText={(v) => { setSenha(v); clearError('senha'); }}
            error={erros.senha}
            secureTextEntry
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
            ref={senhaRef}
          />

          <Input
            label="Confirmar senha *"
            icon="lock-closed-outline"
            placeholder="Repita a senha"
            value={confirmaSenha}
            onChangeText={(v) => { setConfirmaSenha(v); clearError('confirmaSenha'); }}
            error={erros.confirmaSenha}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleCadastro}
            ref={confirmRef}
          />

          <Button
            title="Criar conta"
            onPress={handleCadastro}
            loading={loading}
            style={{ marginTop: 8 }}
          />

          <TouchableOpacity onPress={() => router.back()} style={styles.link}>
            <Text style={styles.linkText}>
              Já tem conta? <Text style={styles.linkHighlight}>Fazer login</Text>
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
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  header: { marginBottom: SPACING.lg },
  backBtn: { marginBottom: SPACING.md },
  backText: { fontSize: 15, color: COLORS.primary, fontWeight: FONT.semiBold },
  title: { fontSize: 28, fontWeight: FONT.extraBold, color: COLORS.textPrimary },
  desc: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
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
