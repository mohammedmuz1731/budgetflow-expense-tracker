import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import TransactionItem from '../components/TransactionItem';
import AddTransactionModal from '../components/AddTransactionModal';

const FILTERS = [
  { key: 'all', label: 'All', icon: 'apps' },
  { key: 'income', label: 'Income', icon: 'arrow-up-circle' },
  { key: 'expense', label: 'Expenses', icon: 'arrow-down-circle' },
];

export default function TransactionsScreen() {
  const { theme, getMonthTransactions, formatVal } = useApp();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingTx, setEditingTx] = useState(null);

  function handleEdit(tx) { setEditingTx(tx); }
  function handleClose() { setEditingTx(null); }

  const monthTx = getMonthTransactions();
  let filtered = [...monthTx];
  if (search.trim()) filtered = filtered.filter(tx => tx.desc.toLowerCase().includes(search.toLowerCase()));
  if (filter !== 'all') filtered = filtered.filter(tx => tx.type === filter);
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalIncome = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <View style={[s.container, { backgroundColor: theme.bg }]}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[s.title, { color: theme.text }]}>Transactions</Text>
        <Text style={[s.subtitle, { color: theme.textMuted }]}>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</Text>
      </View>

      <View style={s.summaryRow}>
        <View style={[s.summaryCard, { backgroundColor: theme.isDark ? 'rgba(16,185,129,0.1)' : '#f0fdf4' }]}>
          <Ionicons name="arrow-up-circle" size={18} color="#10b981" />
          <View>
            <Text style={[s.summaryLabel, { color: theme.textSec }]}>Income</Text>
            <Text style={[s.summaryValue, { color: '#10b981' }]}>{formatVal(totalIncome)}</Text>
          </View>
        </View>
        <View style={[s.summaryCard, { backgroundColor: theme.isDark ? 'rgba(244,63,94,0.1)' : '#fff1f2' }]}>
          <Ionicons name="arrow-down-circle" size={18} color="#f43f5e" />
          <View>
            <Text style={[s.summaryLabel, { color: theme.textSec }]}>Expenses</Text>
            <Text style={[s.summaryValue, { color: '#f43f5e' }]}>{formatVal(totalExpense)}</Text>
          </View>
        </View>
      </View>

      <View style={[s.searchWrap, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
        <Ionicons name="search-outline" size={18} color={theme.textMuted} />
        <TextInput
          style={[s.searchInput, { color: theme.text }]}
          value={search}
          onChangeText={setSearch}
          placeholder="Search transactions..."
          placeholderTextColor={theme.textMuted}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={s.chips}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[s.chip, { backgroundColor: filter === f.key ? '#6366f1' : theme.card, shadowColor: theme.shadow }]}
            onPress={() => setFilter(f.key)}
            activeOpacity={0.8}
          >
            <Ionicons name={f.icon} size={13} color={filter === f.key ? '#fff' : theme.textSec} />
            <Text style={[s.chipText, { color: filter === f.key ? '#fff' : theme.textSec }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.list}>
        {filtered.length === 0 ? (
          <View style={[s.empty, { backgroundColor: theme.card }]}>
            <View style={[s.emptyIconWrap, { backgroundColor: theme.badgeBg }]}>
              <Ionicons name="receipt-outline" size={28} color="#a5b4fc" />
            </View>
            <Text style={[s.emptyTitle, { color: theme.text }]}>Nothing found</Text>
            <Text style={[s.emptyText, { color: theme.textMuted }]}>Try a different search or filter.</Text>
          </View>
        ) : (
          filtered.map(tx => <TransactionItem key={tx.id} tx={tx} showYear onEdit={handleEdit} />)
        )}
      </ScrollView>

      <AddTransactionModal
        visible={editingTx !== null}
        type={editingTx?.type || 'expense'}
        onClose={handleClose}
        editData={editingTx}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  summaryRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 16 },
  summaryCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16 },
  summaryLabel: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
  summaryValue: { fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, marginHorizontal: 20, marginBottom: 12, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '500' },
  chips: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  chipText: { fontSize: 12, fontWeight: '700' },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  empty: { alignItems: 'center', padding: 40, borderRadius: 24, marginTop: 8 },
  emptyIconWrap: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  emptyText: { fontSize: 13, textAlign: 'center' },
});
