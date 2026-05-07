import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { COLORS, SPACING, FONT, RADIUS } from '../../constants/theme';

function MenuItem({ icon, label, onPress, danger }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={20} color={danger ? COLORS.error : COLORS.primary} />
      <Text style={[styles.menuLabel, danger && { color: COLORS.error }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

export default function Perfil() {
  const { user, logout } = useAuth();
  const { favorites, cart } = useAppData();

  function handleLogout() {
    Alert.alert('Sair', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  const initials = user?.name
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? '??';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{favorites.length}</Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statNum}>{cart.length}</Text>
          <Text style={styles.statLabel}>No carrinho</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <MenuItem icon="heart-outline" label="Meus favoritos" onPress={() => {}} />
        <MenuItem icon="bag-outline" label="Meu carrinho" onPress={() => {}} />
        <MenuItem icon="information-circle-outline" label="Sobre o app" onPress={() => {
          Alert.alert('Kitchenet FIAP', 'App desenvolvido para facilitar a experiência dos alunos na cantina da FIAP.\n\nVersão 2.0 · CP2 CPAD');
        }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sessão</Text>
        <MenuItem icon="log-out-outline" label="Sair da conta" onPress={handleLogout} danger />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  avatarSection: { alignItems: 'center', paddingTop: SPACING.xxl, paddingBottom: SPACING.lg },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  initials: { fontSize: 28, fontWeight: FONT.extraBold, color: '#fff' },
  name: { fontSize: 20, fontWeight: FONT.bold, color: COLORS.textPrimary },
  email: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  stats: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: FONT.extraBold, color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  divider: { width: 1, backgroundColor: COLORS.border },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: FONT.bold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: SPACING.sm,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
  },
  menuLabel: { flex: 1, fontSize: 15, color: COLORS.textPrimary, fontWeight: FONT.medium },
});
