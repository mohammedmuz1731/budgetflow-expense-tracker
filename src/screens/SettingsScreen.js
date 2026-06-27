import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';

const CURRENCIES = [
  { label: 'USD', value: '$', symbol: '$' },
  { label: 'EUR', value: '€', symbol: '€' },
  { label: 'GBP', value: '£', symbol: '£' },
  { label: 'INR', value: '₨', symbol: '₨' },
  { label: 'JPY', value: '¥', symbol: '¥' },
  { label: 'TRY', value: '₺', symbol: '₺' },
];

export default function SettingsScreen() {
  const { state, theme, updateSettings, resetAll } = useApp();
  const insets = useSafeAreaInsets();
  const { darkMode, currency } = state.settings;

  function handleReset() {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your transactions and custom categories.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset Everything', style: 'destructive', onPress: resetAll },
      ]
    );
  }

  return (
    <ScrollView
      style={[s.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={[s.content, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.header}>
        <Text style={[s.title, { color: theme.text }]}>Settings</Text>
        <Text style={[s.subtitle, { color: theme.textMuted }]}>Preferences & data</Text>
      </View>

      <LinearGradient colors={['#4f46e5', '#7c3aed']} style={s.profileCard}>
        <View style={s.profileAvatar}>
          <Ionicons name="person" size={26} color="#6366f1" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.profileName}>My Budget</Text>
          <Text style={s.profileSub}>BudgetFlow · SDK 54</Text>
        </View>
        <View style={s.profileBadge}>
          <Text style={s.profileBadgeText}>PRO</Text>
        </View>
      </LinearGradient>

      <Text style={[s.groupLabel, { color: theme.textMuted }]}>Appearance</Text>
      <View style={[s.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
        <View style={s.settingRow}>
          <View style={[s.settingIcon, { backgroundColor: theme.badgeBg }]}>
            <Ionicons name="moon" size={18} color="#6366f1" />
          </View>
          <Text style={[s.settingLabel, { color: theme.text }]}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={val => updateSettings({ darkMode: val })}
            trackColor={{ false: theme.switchTrackOff, true: '#6366f1' }}
            thumbColor="#fff"
            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
          />
        </View>
      </View>

      <Text style={[s.groupLabel, { color: theme.textMuted }]}>Currency</Text>
      <View style={[s.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
        <View style={s.currencyHeader}>
          <View style={[s.settingIcon, { backgroundColor: theme.isDark ? 'rgba(16,185,129,0.15)' : '#dcfce7' }]}>
            <Ionicons name="cash-outline" size={18} color="#10b981" />
          </View>
          <Text style={[s.settingLabel, { color: theme.text }]}>Display Currency</Text>
        </View>
        <View style={s.currencyGrid}>
          {CURRENCIES.map(c => (
            <TouchableOpacity
              key={c.value}
              onPress={() => updateSettings({ currency: c.value })}
              activeOpacity={0.8}
              style={[
                s.currencyChip,
                { backgroundColor: theme.input, borderColor: theme.border },
                currency === c.value && { backgroundColor: theme.badgeBg, borderColor: '#6366f1' },
              ]}
            >
              <Text style={[s.currencySymbol, { color: theme.textSec }, currency === c.value && { color: '#6366f1' }]}>
                {c.symbol}
              </Text>
              <Text style={[s.currencyLabel, { color: theme.textMuted }, currency === c.value && { color: '#6366f1' }]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={[s.groupLabel, { color: theme.textMuted }]}>About</Text>
      <View style={[s.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
        {[
          { icon: 'information-circle-outline', label: 'Version', value: '1.0.0', iconBg: theme.isDark ? 'rgba(59,130,246,0.15)' : '#eff6ff', iconColor: '#3b82f6' },
          { icon: 'code-slash-outline', label: 'Built with', value: 'Expo SDK 54', iconBg: theme.isDark ? 'rgba(16,185,129,0.15)' : '#f0fdf4', iconColor: '#10b981' },
        ].map((item, i, arr) => (
          <View key={item.label}>
            <View style={s.settingRow}>
              <View style={[s.settingIcon, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={18} color={item.iconColor} />
              </View>
              <Text style={[s.settingLabel, { color: theme.text }]}>{item.label}</Text>
              <Text style={[s.settingValue, { color: theme.textMuted }]}>{item.value}</Text>
            </View>
            {i < arr.length - 1 && <View style={[s.rowDivider, { backgroundColor: theme.border }]} />}
          </View>
        ))}
      </View>

      <Text style={[s.groupLabel, { color: theme.textMuted }]}>Data Management</Text>
      <TouchableOpacity
        style={[s.dangerBtn, { backgroundColor: theme.card, borderColor: theme.isDark ? 'rgba(244,63,94,0.3)' : '#fee2e2' }]}
        onPress={handleReset}
        activeOpacity={0.8}
      >
        <View style={[s.dangerIconWrap, { backgroundColor: theme.isDark ? 'rgba(244,63,94,0.15)' : '#fff1f2' }]}>
          <Ionicons name="trash-outline" size={18} color="#f43f5e" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.dangerTitle}>Reset All Data</Text>
          <Text style={[s.dangerSub, { color: theme.isDark ? '#f87171' : '#fca5a5' }]}>Permanently delete all transactions</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#f43f5e" />
      </TouchableOpacity>

      <Text style={[s.footer, { color: theme.textMuted }]}>Made with ♥ · BudgetFlow v1.0.0</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, padding: 18, marginBottom: 28, shadowColor: '#6366f1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  profileAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 16, fontWeight: '800', color: '#fff' },
  profileSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2, fontWeight: '500' },
  profileBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  profileBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  groupLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
  card: { borderRadius: 20, marginBottom: 24, overflow: 'hidden', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
  settingValue: { fontSize: 13, fontWeight: '500' },
  rowDivider: { height: 1, marginHorizontal: 16 },
  currencyHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, paddingBottom: 12 },
  currencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingBottom: 16 },
  currencyChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5 },
  currencySymbol: { fontSize: 14, fontWeight: '800' },
  currencyLabel: { fontSize: 11, fontWeight: '600' },
  dangerBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 20, padding: 16, marginBottom: 28, borderWidth: 1.5, shadowColor: '#f43f5e', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  dangerIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  dangerTitle: { fontSize: 14, fontWeight: '700', color: '#f43f5e' },
  dangerSub: { fontSize: 12, fontWeight: '500', marginTop: 1 },
  footer: { textAlign: 'center', fontSize: 12, fontWeight: '500' },
});
