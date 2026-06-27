import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../AppContext';

export default function TransactionItem({ tx, showYear = false, onEdit }) {
  const { state, theme, deleteTransaction, formatVal } = useApp();
  const cat = state.categories.find(c => c.id === tx.categoryId) || { color: '#64748b', icon: 'pricetag', name: 'Other' };
  const date = new Date(tx.date);
  const dateStr = date.toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', ...(showYear ? { year: 'numeric' } : {}),
  });
  const isIncome = tx.type === 'income';

  return (
    <View style={[s.item, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
      <View style={[s.iconWrap, { backgroundColor: cat.color + '18' }]}>
        <Ionicons name={cat.icon} size={22} color={cat.color} />
      </View>
      <View style={s.info}>
        <Text style={[s.name, { color: theme.text }]} numberOfLines={1}>{tx.desc}</Text>
        <View style={s.metaRow}>
          <View style={[s.catBadge, { backgroundColor: cat.color + '14' }]}>
            <Text style={[s.catBadgeText, { color: cat.color }]}>{cat.name}</Text>
          </View>
          <Text style={[s.dot, { color: theme.border }]}>·</Text>
          <Text style={[s.date, { color: theme.textMuted }]}>{dateStr}</Text>
        </View>
      </View>
      <View style={s.right}>
        <Text style={[s.amount, isIncome ? s.income : s.expense]}>
          {isIncome ? '+' : '-'}{formatVal(tx.amount)}
        </Text>
        <View style={s.actions}>
          <TouchableOpacity onPress={() => onEdit && onEdit(tx)} style={[s.actionBtn, { backgroundColor: theme.badgeBg }]} hitSlop={8}>
            <Ionicons name="pencil" size={13} color="#6366f1" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteTransaction(tx.id)} style={[s.actionBtn, { backgroundColor: theme.isDark ? 'rgba(244,63,94,0.15)' : '#fff1f2' }]} hitSlop={8}>
            <Ionicons name="trash-outline" size={13} color="#f43f5e" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 14, marginBottom: 10, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  iconWrap: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1, gap: 5 },
  name: { fontSize: 14, fontWeight: '700', letterSpacing: -0.1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  catBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  catBadgeText: { fontSize: 10, fontWeight: '700' },
  dot: { fontSize: 10 },
  date: { fontSize: 11, fontWeight: '500' },
  right: { alignItems: 'flex-end', gap: 6 },
  amount: { fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  income: { color: '#10b981' },
  expense: { color: '#f43f5e' },
  actions: { flexDirection: 'row', gap: 6 },
  actionBtn: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
