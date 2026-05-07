import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppData } from '../../context/AppDataContext';
import ItemCard from '../../components/ItemCard';
import { COLORS, SPACING, FONT } from '../../constants/theme';

export default function Favoritos() {
  const router = useRouter();
  const { favorites } = useAppData();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.sub}>{favorites.length} item(s) salvo(s)</Text>
      </View>

      <FlatList
        data={favorites}
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
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
            <Text style={styles.emptyDesc}>
              Toque no coração de qualquer item no cardápio para salvar aqui
            </Text>
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
  list: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  empty: { alignItems: 'center', paddingTop: SPACING.xxl, paddingHorizontal: SPACING.xxl },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: FONT.bold, color: COLORS.textPrimary, textAlign: 'center' },
  emptyDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6, textAlign: 'center', lineHeight: 20 },
});
