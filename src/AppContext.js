import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import { DEFAULT_CATEGORIES, getMockTransactions } from './constants';
import {
  clearAll, loadCategories, loadSettings, loadTransactions,
  saveCategories, saveSettings, saveTransactions,
} from './storage';
import { lightTheme, darkTheme } from './theme';

const AppContext = createContext(null);

const initialState = {
  transactions: [],
  categories: [],
  settings: { currency: '$', darkMode: false },
  currentMonth: new Date(),
  loaded: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, ...action.payload, loaded: true };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'EDIT_TRANSACTION':
      return { ...state, transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'SET_MONTH':
      return { ...state, currentMonth: action.payload };
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'RESET':
      return { ...initialState, loaded: true, categories: [...DEFAULT_CATEGORIES], currentMonth: new Date() };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const toastRef = useRef(null);

  useEffect(() => {
    (async () => {
      const [savedTx, savedCats, savedSettings] = await Promise.all([
        loadTransactions(), loadCategories(), loadSettings(),
      ]);
      const categories = savedCats || [...DEFAULT_CATEGORIES];
      const transactions = savedTx || getMockTransactions(new Date());
      const settings = savedSettings || { currency: '$', darkMode: false };
      if (!savedCats) saveCategories(categories);
      if (!savedTx) saveTransactions(transactions);
      dispatch({ type: 'INIT', payload: { transactions, categories, settings } });
    })();
  }, []);

  function addTransaction(amount, categoryId, date, desc, type) {
    const tx = { id: 'tx-' + Date.now(), amount: parseFloat(amount), categoryId, date, desc: desc.trim(), type };
    dispatch({ type: 'ADD_TRANSACTION', payload: tx });
    saveTransactions([...state.transactions, tx]);
    showToast(`${type === 'income' ? 'Income' : 'Expense'} added`, 'success');
  }

  function deleteTransaction(id) {
    const next = state.transactions.filter(t => t.id !== id);
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    saveTransactions(next);
    showToast('Transaction deleted', 'success');
  }

  function editTransaction(id, amount, categoryId, date, desc, type) {
    const updated = { id, amount: parseFloat(amount), categoryId, date, desc: desc.trim(), type };
    const next = state.transactions.map(t => t.id === id ? updated : t);
    dispatch({ type: 'EDIT_TRANSACTION', payload: updated });
    saveTransactions(next);
    showToast('Transaction updated', 'success');
  }

  function addCategory(name, budget, color) {
    const cat = { id: 'cat-' + Date.now(), name: name.trim(), type: 'expense', budget: budget ? parseFloat(budget) : 0, color, icon: 'pricetag' };
    dispatch({ type: 'ADD_CATEGORY', payload: cat });
    saveCategories([...state.categories, cat]);
    showToast(`Category "${name}" created`, 'success');
  }

  function updateSettings(patch) {
    const next = { ...state.settings, ...patch };
    dispatch({ type: 'SET_SETTINGS', payload: patch });
    saveSettings(next);
  }

  function setMonth(date) {
    dispatch({ type: 'SET_MONTH', payload: date });
  }

  async function resetAll() {
    await clearAll();
    const cats = [...DEFAULT_CATEGORIES];
    const settings = { currency: '$', darkMode: false };
    await Promise.all([
      saveCategories(cats),
      saveTransactions([]),
      saveSettings(settings),
    ]);
    dispatch({ type: 'INIT', payload: { transactions: [], categories: cats, settings } });
    showToast('All data reset', 'success');
  }

  function getMonthTransactions() {
    const year = state.currentMonth.getFullYear();
    const month = state.currentMonth.getMonth();
    return state.transactions.filter(tx => {
      const d = new Date(tx.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }

  function formatVal(amount) {
    return `${state.settings.currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function showToast(message, type = 'success') {
    if (toastRef.current) toastRef.current(message, type);
  }

  return (
    <AppContext.Provider value={{
      state,
      theme: state.settings.darkMode ? darkTheme : lightTheme,
      addTransaction, deleteTransaction, editTransaction, addCategory,
      updateSettings, setMonth, resetAll, getMonthTransactions, formatVal,
      registerToast: (fn) => { toastRef.current = fn; },
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
