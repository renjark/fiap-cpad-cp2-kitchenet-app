import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '../context/AppDataContext';
import Button from '../components/Button';
import { COLORS, SPACING, FONT, RADIUS } from '../constants/theme';
import { ITEMS } from '../constants/items';

const { width, height } = Dimensions.get('window');

export default function Details() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addToCart, toggleFavorite, isFavorite } = useAppData();

  const item = ITEMS.find((i) => i.id === id);
  if (!item) return null;

  const fav = isFavorite(item.id);

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(item)}>
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? COLORS.primary : '#fff'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>

        <Text style={styles.price}>{item.price}</Text>

        <View style={styles.tagRow}>
          {item.categories.map((cat) => (
            <View key={cat} style={styles.tag}>
              <Ionicons name="business-outline" size={12} color={COLORS.primary} />
              <Text style={styles.tagText}>{cat}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Descrição</Text>
        <Text style={styles.desc}>{item.description}</Text>

        <Button
          title="Adicionar ao carrinho"
          onPress={() => {
            addToCart(item);
            router.back();
          }}
          style={{ marginTop: SPACING.lg }}
        />

        <Button
          title="Ver carrinho"
          variant="outline"
          onPress={() => router.push('/(tabs)/carrinho')}
          style={{ marginTop: SPACING.sm }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  imageWrapper: { position: 'relative' },
  image: {
    width,
    height: height * 0.38,
    resizeMode: 'cover',
    backgroundColor: COLORS.skeleton,
  },
  backBtn: {
    position: 'absolute',
    top: SPACING.xxl,
    left: SPACING.lg,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: RADIUS.full,
    padding: 8,
  },
  favBtn: {
    position: 'absolute',
    top: SPACING.xxl,
    right: SPACING.lg,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: RADIUS.full,
    padding: 8,
  },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: {
    flex: 1,
    fontSize: 24,
    fontWeight: FONT.extraBold,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  emoji: { fontSize: 32 },
  price: {
    fontSize: 22,
    fontWeight: FONT.extraBold,
    color: COLORS.primary,
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: SPACING.lg },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF0F5',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { fontSize: 12, color: COLORS.primary, fontWeight: FONT.semiBold },
  sectionLabel: {
    fontSize: 13,
    fontWeight: FONT.bold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  desc: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 22 },
});
