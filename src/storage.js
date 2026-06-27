import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  transactions: 'budgetflow_transactions',
  categories: 'budgetflow_categories',
  settings: 'budgetflow_settings',
};

export async function loadTransactions() {
  const raw = await AsyncStorage.getItem(KEYS.transactions);
  return raw ? JSON.parse(raw) : null;
}

export async function saveTransactions(data) {
  await AsyncStorage.setItem(KEYS.transactions, JSON.stringify(data));
}

export async function loadCategories() {
  const raw = await AsyncStorage.getItem(KEYS.categories);
  return raw ? JSON.parse(raw) : null;
}

export async function saveCategories(data) {
  await AsyncStorage.setItem(KEYS.categories, JSON.stringify(data));
}

export async function loadSettings() {
  const raw = await AsyncStorage.getItem(KEYS.settings);
  return raw ? JSON.parse(raw) : null;
}

export async function saveSettings(data) {
  await AsyncStorage.setItem(KEYS.settings, JSON.stringify(data));
}

export async function clearAll() {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
