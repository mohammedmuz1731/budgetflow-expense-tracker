export const DEFAULT_CATEGORIES = [
  { id: 'cat-food', name: 'Food & Dining', type: 'expense', budget: 400, color: '#f43f5e', icon: 'restaurant' },
  { id: 'cat-shopping', name: 'Shopping', type: 'expense', budget: 200, color: '#a855f7', icon: 'bag-handle' },
  { id: 'cat-housing', name: 'Rent & Housing', type: 'expense', budget: 1200, color: '#3b82f6', icon: 'home' },
  { id: 'cat-transport', name: 'Transport', type: 'expense', budget: 150, color: '#f59e0b', icon: 'car' },
  { id: 'cat-entertainment', name: 'Entertainment', type: 'expense', budget: 150, color: '#ec4899', icon: 'tv' },
  { id: 'cat-utilities', name: 'Bills & Utilities', type: 'expense', budget: 300, color: '#06b6d4', icon: 'flash' },
  { id: 'cat-salary', name: 'Salary', type: 'income', budget: 0, color: '#10b981', icon: 'cash' },
  { id: 'cat-freelance', name: 'Freelance Work', type: 'income', budget: 0, color: '#10b981', icon: 'laptop' },
  { id: 'cat-investments', name: 'Investments', type: 'income', budget: 0, color: '#3b82f6', icon: 'trending-up' },
  { id: 'cat-other-income', name: 'Other Income', type: 'income', budget: 0, color: '#64748b', icon: 'pricetag' },
];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const COLORS = {
  primary: '#6366f1',
  primaryGlow: 'rgba(99,102,241,0.15)',
  secondary: '#a855f7',
  success: '#10b981',
  successGlow: 'rgba(16,185,129,0.15)',
  danger: '#f43f5e',
  dangerGlow: 'rgba(244,63,94,0.15)',
};

export const PALETTE = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export function getMockTransactions(baseDate) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const d = (day) => new Date(year, month, day).toISOString().split('T')[0];
  return [
    { id: 'tx-1', amount: 3500, type: 'income', categoryId: 'cat-salary', desc: 'Monthly Salary Payment', date: d(5) },
    { id: 'tx-2', amount: 120.50, type: 'expense', categoryId: 'cat-food', desc: 'Weekly Grocery Store', date: d(12) },
    { id: 'tx-3', amount: 45, type: 'expense', categoryId: 'cat-transport', desc: 'Fuel and Highway Tolls', date: d(18) },
    { id: 'tx-4', amount: 650, type: 'income', categoryId: 'cat-freelance', desc: 'Mobile UI Client Design', date: d(22) },
    { id: 'tx-5', amount: 89.99, type: 'expense', categoryId: 'cat-shopping', desc: 'New Wireless Headphones', date: d(25) },
  ];
}
