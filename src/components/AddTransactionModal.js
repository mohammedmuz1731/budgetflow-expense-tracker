import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, KeyboardAvoidingView, Modal, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '../AppContext';

export default function AddTransactionModal({ visible, type, onClose, editData = null }) {
  const { state, theme, addTransaction, editTransaction } = useApp();
  const isEditing = editData !== null;

  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCat, setSelectedCat] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const slideAnim = useRef(new Animated.Value(500)).current;

  const cats = state.categories.filter(c => c.type === type);
  const isIncome = type === 'income';
  const accentColor = isIncome ? '#10b981' : '#f43f5e';
  const gradientColors = isIncome ? ['#059669', '#10b981'] : ['#e11d48', '#f43f5e'];

  useEffect(() => {
    if (visible) {
      if (isEditing) {
        setAmount(String(editData.amount));
        setDesc(editData.desc);
        setSelectedDate(new Date(editData.date));
        setSelectedCat(editData.categoryId);
      } else {
        setAmount('');
        setDesc('');
        setSelectedDate(new Date());
        setSelectedCat(cats[0]?.id || null);
      }
      setShowPicker(false);
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 500, duration: 260, useNativeDriver: true }).start();
    }
  }, [visible]);

  function handleSubmit() {
    if (!amount || parseFloat(amount) <= 0 || !selectedCat || !desc.trim()) return;
    const dateStr = selectedDate.toISOString().split('T')[0];
    if (isEditing) {
      editTransaction(editData.id, amount, selectedCat, dateStr, desc, type);
    } else {
      addTransaction(amount, selectedCat, dateStr, desc, type);
    }
    onClose();
  }

  function onDateChange(event, date) {
    if (Platform.OS === 'android') setShowPicker(false);
    if (date) setSelectedDate(date);
  }

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={[s.overlay, { backgroundColor: theme.overlayBg }]} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.kv}>
        <Animated.View style={[s.sheet, { backgroundColor: theme.sheetBg, transform: [{ translateY: slideAnim }] }]}>

          <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.sheetHeader}>
            <View style={{ flex: 1 }}>
              <Text style={s.sheetLabel}>
                {isEditing ? `Edit ${isIncome ? 'Income' : 'Expense'}` : `New ${isIncome ? 'Income' : 'Expense'}`}
              </Text>
              <View style={s.amountRow}>
                <Text style={s.currencySign}>{state.settings.currency}</Text>
                <TextInput
                  style={s.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  keyboardType="decimal-pad"
                  autoFocus={!isEditing}
                  selectionColor="rgba(255,255,255,0.8)"
                />
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <Ionicons name="close" size={18} color="rgba(255,255,255,0.85)" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={s.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            {/* Date */}
            <Text style={[s.sectionLabel, { color: theme.textMuted }]}>Date</Text>
            <TouchableOpacity
              style={[s.dateRow, { backgroundColor: theme.input, borderColor: theme.border }]}
              onPress={() => setShowPicker(true)}
              activeOpacity={0.75}
            >
              <View style={[s.dateIconWrap, { backgroundColor: accentColor + '18' }]}>
                <Ionicons name="calendar" size={18} color={accentColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.dateText, { color: theme.text }]}>{formattedDate}</Text>
                <Text style={[s.dateSub, { color: theme.textMuted }]}>Tap to change date</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
            </TouchableOpacity>

            {showPicker && (
              <View style={[s.pickerWrap, { backgroundColor: theme.input, borderColor: theme.border }]}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date(2100, 11, 31)}
                  minimumDate={new Date(2000, 0, 1)}
                  accentColor={accentColor}
                  themeVariant={theme.isDark ? 'dark' : 'light'}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={[s.pickerDoneBtn, { backgroundColor: accentColor }]}
                    onPress={() => setShowPicker(false)}
                  >
                    <Text style={s.pickerDoneText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Category */}
            <Text style={[s.sectionLabel, { color: theme.textMuted }]}>Category</Text>
            <View style={s.catGrid}>
              {cats.map(cat => {
                const active = selectedCat === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[s.catItem, { backgroundColor: theme.input, borderColor: active ? accentColor : theme.border },
                      active && { backgroundColor: accentColor + '10' }]}
                    onPress={() => setSelectedCat(cat.id)}
                    activeOpacity={0.75}
                  >
                    <View style={[s.catIconWrap, { backgroundColor: cat.color + '18' }]}>
                      <Ionicons name={cat.icon} size={18} color={cat.color} />
                    </View>
                    <Text style={[s.catLabel, { color: active ? accentColor : theme.textSec }]} numberOfLines={1}>
                      {cat.name}
                    </Text>
                    {active && (
                      <View style={[s.catCheck, { backgroundColor: accentColor }]}>
                        <Ionicons name="checkmark" size={9} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Description */}
            <Text style={[s.sectionLabel, { color: theme.textMuted }]}>Description</Text>
            <View style={[s.inputWrap, { backgroundColor: theme.input, borderColor: theme.border }]}>
              <Ionicons name="create-outline" size={16} color={theme.textMuted} />
              <TextInput
                style={[s.input, { color: theme.text }]}
                value={desc}
                onChangeText={setDesc}
                placeholder="What was this for?"
                placeholderTextColor={theme.textMuted}
              />
            </View>

            {/* Submit */}
            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85} style={s.submitBtn}>
              <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.submitGradient}>
                <Ionicons name={isEditing ? 'checkmark-circle' : (isIncome ? 'trending-up' : 'trending-down')} size={18} color="#fff" />
                <Text style={s.submitText}>
                  {isEditing ? 'Save Changes' : (isIncome ? 'Add Income' : 'Add Expense')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject },
  kv: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 32, borderTopRightRadius: 32, maxHeight: '92%', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 20 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 24, paddingBottom: 24, paddingHorizontal: 24 },
  sheetLabel: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  amountRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  currencySign: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 6 },
  amountInput: { fontSize: 48, fontWeight: '800', color: '#fff', minWidth: 120, letterSpacing: -1 },
  closeBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: 22, paddingTop: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1.5, padding: 14, marginBottom: 6 },
  dateIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dateText: { fontSize: 14, fontWeight: '700' },
  dateSub: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  pickerWrap: { borderRadius: 16, overflow: 'hidden', marginBottom: 16, borderWidth: 1.5 },
  pickerDoneBtn: { marginHorizontal: 16, marginBottom: 12, borderRadius: 12, paddingVertical: 11, alignItems: 'center' },
  pickerDoneText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  catItem: { width: '22%', alignItems: 'center', padding: 10, borderRadius: 16, borderWidth: 1.5, position: 'relative' },
  catIconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  catLabel: { fontSize: 9, fontWeight: '700', textAlign: 'center' },
  catCheck: { position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, marginBottom: 18 },
  input: { flex: 1, paddingVertical: 13, fontSize: 14, fontWeight: '500' },
  submitBtn: { borderRadius: 18, overflow: 'hidden', marginBottom: 34, marginTop: 4 },
  submitGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 17 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
});
