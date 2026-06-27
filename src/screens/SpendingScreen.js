import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import TransactionItem from '../components/TransactionItem';
import AddTransactionModal from '../components/AddTransactionModal';
import { MONTH_NAMES } from '../constants';

export default function SpendingScreen() {
  const { state, theme, setMonth, getMonthTransactions, formatVal } = useApp();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [modalType, setModalType] = useState(null);
  const [editingTx, setEditingTx] = useState(null);

  function handleEdit(tx) { setEditingTx(tx); setModalType(tx.type); }
  function handleClose() { setModalType(null); setEditingTx(null); }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const monthTx = getMonthTransactions();
  let income = 0, expense = 0;
  monthTx.forEach(tx => { tx.type === 'income' ? (income += tx.amount) : (expense += tx.amount); });
  const balance = income - expense;

  const recent = [...monthTx].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  const monthLabel = `${MONTH_NAMES[state.currentMonth.getMonth()]} ${state.currentMonth.getFullYear()}`;

  function prevMonth() {
    const d = new Date(state.currentMonth); d.setMonth(d.getMonth() - 1); setMonth(d);
  }
  function nextMonth() {
    const d = new Date(state.currentMonth); d.setMonth(d.getMonth() + 1); setMonth(d);
  }

  return (
    <View style={[s.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.content, { paddingTop: insets.top + 20 }]}
      >
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={[s.greetingSmall, { color: theme.textMuted }]}>{greeting} 👋</Text>
            <Text style={[s.appTitle, { color: theme.text }]}>BudgetFlow</Text>
          </View>
          <View style={[s.avatarCircle, { backgroundColor: theme.badgeBg }]}>
            <Ionicons name="person" size={20} color="#6366f1" />
          </View>
        </View>

        {/* Balance Card — gradient stays always */}
        <LinearGradient
          colors={['#4f46e5', '#7c3aed', '#9333ea']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={s.balanceCard}
        >
          <View style={s.deco1} /><View style={s.deco2} />
          <View style={s.monthRow}>
            <TouchableOpacity onPress={prevMonth} style={s.monthBtn}>
              <Ionicons name="chevron-back" size={18} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
            <Text style={s.monthLabel}>{monthLabel}</Text>
            <TouchableOpacity onPress={nextMonth} style={s.monthBtn}>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>
          <Text style={s.balanceLbl}>Total Balance</Text>
          <Text style={s.balanceAmount}>{formatVal(balance)}</Text>
          <View style={s.balanceDivider} />
          <View style={s.balanceRow}>
            <View style={s.balanceStat}>
              <View style={s.statIconWrap}>
                <Ionicons name="arrow-up" size={14} color="#34d399" />
              </View>
              <View>
                <Text style={s.subLabel}>Income</Text>
                <Text style={s.subValue}>{formatVal(income)}</Text>
              </View>
            </View>
            <View style={s.statDivider} />
            <View style={s.balanceStat}>
              <View style={[s.statIconWrap, { backgroundColor: 'rgba(251,113,133,0.2)' }]}>
                <Ionicons name="arrow-down" size={14} color="#fb7185" />
              </View>
              <View>
                <Text style={s.subLabel}>Expenses</Text>
                <Text style={s.subValue}>{formatVal(expense)}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={s.actionRow}>
          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => setModalType('expense')} activeOpacity={0.85}
          >
            <View style={s.actionIconCircleRed}>
              <Ionicons name="remove" size={20} color="#f43f5e" />
            </View>
            <Text style={[s.actionBtnText, { color: '#f43f5e' }]}>Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => setModalType('income')} activeOpacity={0.85}
          >
            <View style={s.actionIconCircleGreen}>
              <Ionicons name="add" size={20} color="#10b981" />
            </View>
            <Text style={[s.actionBtnText, { color: '#10b981' }]}>Add Income</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={s.sectionRow}>
          <Text style={[s.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
          <TouchableOpacity style={s.seeAllBtn} onPress={() => navigation.navigate('Transactions')}>
            <Text style={s.sectionLink}>See All</Text>
            <Ionicons name="chevron-forward" size={14} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {recent.length === 0 ? (
          <View style={[s.empty, { backgroundColor: theme.card }]}>
            <View style={s.emptyIconWrap}>
              <Ionicons name="receipt-outline" size={30} color="#a5b4fc" />
            </View>
            <Text style={[s.emptyTitle, { color: theme.text }]}>No transactions yet</Text>
            <Text style={[s.emptyText, { color: theme.textMuted }]}>Add your first income or expense{'\n'}to start tracking your budget.</Text>
          </View>
        ) : (
          recent.map(tx => <TransactionItem key={tx.id} tx={tx} onEdit={handleEdit} />)
        )}
      </ScrollView>

      <AddTransactionModal
        visible={modalType !== null}
        type={modalType || 'expense'}
        onClose={handleClose}
        editData={editingTx}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  greetingSmall: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  appTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  balanceCard: { borderRadius: 28, padding: 22, marginBottom: 16, overflow: 'hidden', shadowColor: '#6366f1', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 10 },
  deco1: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.07)', top: -60, right: -40 },
  deco2: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -30, left: -20 },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  monthBtn: { padding: 4 },
  monthLabel: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: 0.3 },
  balanceLbl: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  balanceAmount: { fontSize: 40, fontWeight: '800', color: '#fff', letterSpacing: -1.5, marginBottom: 22 },
  balanceDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 18 },
  balanceRow: { flexDirection: 'row', alignItems: 'center' },
  balanceStat: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  statIconWrap: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(52,211,153,0.2)', alignItems: 'center', justifyContent: 'center' },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 16 },
  subLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginBottom: 2 },
  subValue: { fontSize: 16, fontWeight: '700', color: '#fff' },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16, paddingHorizontal: 16, borderRadius: 18, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  actionIconCircleRed: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(244,63,94,0.12)', alignItems: 'center', justifyContent: 'center' },
  actionIconCircleGreen: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(16,185,129,0.12)', alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 14, fontWeight: '700' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  sectionLink: { fontSize: 13, color: '#6366f1', fontWeight: '600' },
  empty: { alignItems: 'center', padding: 36, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  emptyIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptyText: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
