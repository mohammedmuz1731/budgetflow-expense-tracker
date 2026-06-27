import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { PALETTE } from '../constants';

export default function CategoriesScreen() {
  const { state, theme, addCategory, getMonthTransactions, formatVal } = useApp();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [color, setColor] = useState(PALETTE[0]);

  const monthTx = getMonthTransactions();
  const totals = {};
  state.categories.filter(c => c.type === 'expense').forEach(c => { totals[c.id] = 0; });
  monthTx.forEach(tx => { if (tx.type === 'expense' && totals[tx.categoryId] !== undefined) totals[tx.categoryId] += tx.amount; });

  const expenseCats = state.categories.filter(c => c.type === 'expense');
  const totalBudgeted = expenseCats.reduce((s, c) => s + (c.budget || 0), 0);
  const totalSpentAll = expenseCats.reduce((s, c) => s + (totals[c.id] || 0), 0);

  function handleAdd() {
    if (!name.trim()) { Alert.alert('Missing name', 'Please enter a category name'); return; }
    addCategory(name, budget, color);
    setName(''); setBudget(''); setColor(PALETTE[0]);
  }

  return (
    <ScrollView
      style={[s.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={[s.content, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.header}>
        <Text style={[s.title, { color: theme.text }]}>Categories</Text>
        <Text style={[s.subtitle, { color: theme.textMuted }]}>Budget overview</Text>
      </View>

      {totalBudgeted > 0 && (
        <LinearGradient colors={['#1e1b4b', '#312e81']} style={s.overallCard}>
          <View style={s.overallRow}>
            <View>
              <Text style={s.overallLabel}>Total Budgeted</Text>
              <Text style={s.overallAmount}>{formatVal(totalBudgeted)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.overallLabel}>Spent</Text>
              <Text style={[s.overallAmount, { color: totalSpentAll > totalBudgeted ? '#fb7185' : '#34d399' }]}>
                {formatVal(totalSpentAll)}
              </Text>
            </View>
          </View>
          <View style={s.overallProgressBg}>
            <View style={[s.overallProgressFill, {
              width: `${Math.min((totalSpentAll / totalBudgeted) * 100, 100)}%`,
              backgroundColor: totalSpentAll > totalBudgeted ? '#fb7185' : '#34d399',
            }]} />
          </View>
          <Text style={s.overallRemaining}>
            {totalSpentAll > totalBudgeted
              ? `${formatVal(totalSpentAll - totalBudgeted)} over budget`
              : `${formatVal(totalBudgeted - totalSpentAll)} remaining`}
          </Text>
        </LinearGradient>
      )}

      {expenseCats.map(cat => {
        const spent = totals[cat.id] || 0;
        const limit = cat.budget || 0;
        const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
        const overBudget = limit > 0 && spent > limit;

        return (
          <View key={cat.id} style={[s.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
            <View style={s.cardTop}>
              <View style={s.catMeta}>
                <View style={[s.catIcon, { backgroundColor: cat.color + '18' }]}>
                  <Ionicons name={cat.icon} size={20} color={cat.color} />
                </View>
                <View>
                  <Text style={[s.catName, { color: theme.text }]}>{cat.name}</Text>
                  {limit > 0 && <Text style={[s.catLimit, { color: theme.textMuted }]}>Limit {formatVal(limit)}</Text>}
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[s.catSpent, { color: overBudget ? '#f43f5e' : theme.text }]}>{formatVal(spent)}</Text>
                {limit > 0 && (
                  <Text style={[s.catPct, { color: overBudget ? '#f43f5e' : cat.color }]}>
                    {Math.round((spent / limit) * 100)}%
                  </Text>
                )}
              </View>
            </View>

            {limit > 0 && (
              <View style={[s.progressBg, { backgroundColor: theme.cardAlt }]}>
                <View style={[s.progressFill, { width: `${pct}%`, backgroundColor: overBudget ? '#f43f5e' : cat.color }]} />
              </View>
            )}

            {overBudget && (
              <View style={[s.overBudgetBadge, { backgroundColor: theme.isDark ? 'rgba(244,63,94,0.12)' : '#fff1f2' }]}>
                <Ionicons name="warning" size={11} color="#f43f5e" />
                <Text style={s.overBudgetText}>Over budget by {formatVal(spent - limit)}</Text>
              </View>
            )}
          </View>
        );
      })}

      <View style={[s.formCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
        <View style={s.formTitleRow}>
          <View style={[s.formIconWrap, { backgroundColor: theme.badgeBg }]}>
            <Ionicons name="add" size={18} color="#6366f1" />
          </View>
          <Text style={[s.formTitle, { color: theme.text }]}>New Category</Text>
        </View>

        <Text style={[s.inputLabel, { color: theme.textMuted }]}>Name</Text>
        <TextInput
          style={[s.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Health, Gym, Gift"
          placeholderTextColor={theme.textMuted}
        />

        <Text style={[s.inputLabel, { color: theme.textMuted }]}>Monthly Budget (optional)</Text>
        <TextInput
          style={[s.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
          value={budget}
          onChangeText={setBudget}
          placeholder="e.g. 200"
          placeholderTextColor={theme.textMuted}
          keyboardType="numeric"
        />

        <Text style={[s.inputLabel, { color: theme.textMuted }]}>Color</Text>
        <View style={s.palette}>
          {PALETTE.map(c => (
            <TouchableOpacity key={c} onPress={() => setColor(c)} activeOpacity={0.8}>
              <View style={[s.swatch, { backgroundColor: c }]}>
                {color === c && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={s.addBtn} onPress={handleAdd} activeOpacity={0.85}>
          <LinearGradient colors={['#6366f1', '#8b5cf6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.addBtnGradient}>
            <Ionicons name="add-circle-outline" size={18} color="#fff" />
            <Text style={s.addBtnText}>Add Category</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 32 },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  overallCard: { borderRadius: 22, padding: 20, marginBottom: 18, shadowColor: '#312e81', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  overallRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  overallLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  overallAmount: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  overallProgressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden', marginBottom: 10 },
  overallProgressFill: { height: '100%', borderRadius: 3 },
  overallRemaining: { fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: '500' },
  card: { borderRadius: 20, padding: 16, marginBottom: 10, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  catMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  catIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  catName: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  catLimit: { fontSize: 11, fontWeight: '500' },
  catSpent: { fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  catPct: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  progressBg: { height: 7, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  overBudgetBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  overBudgetText: { fontSize: 11, color: '#f43f5e', fontWeight: '600' },
  formCard: { borderRadius: 22, padding: 20, marginTop: 10, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  formTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  formIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  formTitle: { fontSize: 16, fontWeight: '800' },
  inputLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  input: { borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, fontWeight: '500', marginBottom: 16 },
  palette: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  swatch: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  addBtn: { borderRadius: 14, overflow: 'hidden' },
  addBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
