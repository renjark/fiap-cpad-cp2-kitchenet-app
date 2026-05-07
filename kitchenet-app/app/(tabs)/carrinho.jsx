import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '../../context/AppDataContext';
import Button from '../../components/Button';
import { COLORS, SPACING, FONT, RADIUS } from '../../constants/theme';

function CartItem({ item }) {
  const { updateQty, removeFromCart } = useAppData();

  return (
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.img} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            onPress={() => updateQty(item.id, item.qty - 1)}
            style={styles.qtyBtn}
          >
            <Ionicons name="remove" size={16} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.qty}>{item.qty}</Text>
          <TouchableOpacity
            onPress={() => updateQty(item.id, item.qty + 1)}
            style={styles.qtyBtn}
          >
            <Ionicons name="add" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
        <Ionicons name="trash-outline" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

export default function Carrinho() {
  const { cart, cartTotal, clearCart } = useAppData();

  function handlePedido() {
    Alert.alert(
      'Pedido confirmado!',
      `Total: R$ ${cartTotal.toFixed(2).replace('.', ',')}\n\nDirija-se ao andar correspondente para retirar.`,
      [{ text: 'OK', onPress: clearCart }]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Carrinho 🛍️</Text>
        <Text style={styles.sub}>{cart.length} item(s)</Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <CartItem item={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Carrinho vazio</Text>
            <Text style={styles.emptyDesc}>Adicione itens pelo cardápio</Text>
          </View>
        }
      />

      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.total}>R$ {cartTotal.toFixed(2).replace('.', ',')}</Text>
          </View>
          <Button title="Confirmar pedido" onPress={handlePedido} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl, paddingBottom: SPACING.md },
  title: { fontSize: 26, fontWeight: FONT.extraBold, color: COLORS.textPrimary },
  sub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: 120 },
  item: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    gap: SPACING.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  img: { width: 60, height: 60, borderRadius: RADIUS.sm, resizeMode: 'cover', backgroundColor: COLORS.skeleton },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: FONT.bold, color: COLORS.textPrimary },
  price: { fontSize: 13, color: COLORS.primary, fontWeight: FONT.semiBold, marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.background,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  qty: { fontSize: 15, fontWeight: FONT.bold, color: COLORS.textPrimary, minWidth: 20, textAlign: 'center' },
  removeBtn: { padding: 6 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  totalLabel: { fontSize: 16, color: COLORS.textSecondary },
  total: { fontSize: 20, fontWeight: FONT.extraBold, color: COLORS.primary },
  empty: { alignItems: 'center', paddingTop: SPACING.xxl },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: FONT.bold, color: COLORS.textPrimary },
  emptyDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
});
