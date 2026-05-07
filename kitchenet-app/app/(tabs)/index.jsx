import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import ItemCard from '../../components/ItemCard';
import { COLORS, SPACING, FONT, RADIUS } from '../../constants/theme';
import { ITEMS } from '../../constants/items';

const DESTAQUES = ITEMS.slice(0, 3);

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartCount } = useAppData();

  const firstName = user?.name?.split(' ')[0] ?? 'por aí';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {firstName}! 👋</Text>
          <Text style={styles.sub}>O que vai comer hoje?</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/carrinho')} style={styles.cartBtn}>
          <Ionicons name="bag-outline" size={22} color={COLORS.primary} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>🍽️ Kitchenet FIAP</Text>
        <Text style={styles.bannerDesc}>5° e 7° andares · Segunda a Sexta</Text>
        <TouchableOpacity style={styles.bannerBtn} onPress={() => router.push('/(tabs)/pesquisa')}>
          <Text style={styles.bannerBtnText}>Ver cardápio completo →</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Filtrar por andar</Text>
      <View style={styles.andares}>
        {['5° andar', '7° andar'].map((a) => (
          <TouchableOpacity
            key={a}
            style={styles.andarCard}
            onPress={() => router.push({ pathname: '/(tabs)/pesquisa', params: { andar: a } })}
          >
            <Ionicons name="business-outline" size={20} color={COLORS.primary} />
            <Text style={styles.andarText}>{a}</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Destaques</Text>
      {DESTAQUES.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onPress={() =>
            router.push({ pathname: '/details', params: { id: item.id } })
          }
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  greeting: { fontSize: 22, fontWeight: FONT.bold, color: COLORS.textPrimary },
  sub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  cartBtn: { position: 'relative', padding: 4 },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    borderRadius: 99,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  banner: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  bannerTitle: { fontSize: 20, fontWeight: FONT.extraBold, color: '#fff' },
  bannerDesc: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4, marginBottom: SPACING.md },
  bannerBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.sm,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  bannerBtnText: { color: '#fff', fontWeight: FONT.semiBold, fontSize: 13 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: FONT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginTop: 4,
  },
  andares: { gap: 8, marginBottom: SPACING.lg },
  andarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  andarText: { flex: 1, fontSize: 15, fontWeight: FONT.semiBold, color: COLORS.textPrimary },
});
