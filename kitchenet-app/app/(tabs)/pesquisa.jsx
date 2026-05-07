import { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ItemCard from '../../components/ItemCard';
import { COLORS, SPACING, FONT, RADIUS } from '../../constants/theme';
import { ITEMS } from '../../constants/items';

const CATEGORIAS = ['Todos', '5° andar', '7° andar'];

export default function Pesquisa() {
  const router = useRouter();
  const { andar } = useLocalSearchParams();

  const [query, setQuery] = useState('');
  const [categoria, setCategoria] = useState(andar ?? 'Todos');

  const results = useMemo(() => {
    let filtered = ITEMS;
    if (categoria !== 'Todos') {
      filtered = filtered.filter((i) => i.categories.includes(categoria));
    }
    if (query.trim()) {
      filtered = filtered.filter((i) =>
        i.name.toLowerCase().includes(query.trim().toLowerCase())
      );
    }
    return filtered;
  }, [query, categoria]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cardápio 🍽️</Text>
        <Text style={styles.sub}>Encontre o que está com vontade</Text>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Pesquisar item..."
          placeholderTextColor={COLORS.textMuted}
        />
        {query ? (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.chips}>
        {CATEGORIAS.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategoria(cat)}
            style={[styles.chip, categoria === cat && styles.chipAtivo]}
          >
            <Text style={[styles.chipText, categoria === cat && styles.chipTextoAtivo]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={results}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => router.push({ pathname: '/details', params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>Nada encontrado</Text>
            <Text style={styles.emptyDesc}>Tente outro nome ou filtro</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl, paddingBottom: SPACING.md },
  title: { fontSize: 26, fontWeight: FONT.extraBold, color: COLORS.textPrimary },
  sub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 48,
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  chips: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: 8,
    marginBottom: SPACING.md,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipAtivo: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: FONT.medium },
  chipTextoAtivo: { color: '#fff', fontWeight: FONT.bold },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  empty: { alignItems: 'center', paddingTop: SPACING.xxl },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: FONT.bold, color: COLORS.textPrimary },
  emptyDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
});
