import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';
import { useAppData } from '../context/AppDataContext';

export default function ItemCard({ item, onPress }) {
  const { isFavorite, toggleFavorite } = useAppData();
  const fav = isFavorite(item.id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <TouchableOpacity
        style={styles.favBtn}
        onPress={() => toggleFavorite(item)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={fav ? 'heart' : 'heart-outline'}
          size={20}
          color={fav ? COLORS.primary : '#fff'}
        />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{item.price}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.categories[0]}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
    backgroundColor: COLORS.skeleton,
  },
  favBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: RADIUS.full,
    padding: 6,
  },
  info: { padding: SPACING.md },
  name: {
    fontSize: 15,
    fontWeight: FONT.bold,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 16, fontWeight: FONT.extraBold, color: COLORS.primary },
  badge: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: FONT.medium },
});
