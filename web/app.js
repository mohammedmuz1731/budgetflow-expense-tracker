// --- STATE MANAGEMENT ---
let state = {
  transactions: [],
  categories: [],
  settings: {
    currency: '$',
    darkMode: false
  },
  currentMonth: new Date(), // Localized date tracker
  activeTab: 'spending'
};

// Default Categories Configuration
const DEFAULT_CATEGORIES = [
  { id: 'cat-food', name: 'Food & Dining', type: 'expense', budget: 400, color: '#f43f5e', icon: 'food' },
  { id: 'cat-shopping', name: 'Shopping', type: 'expense', budget: 200, color: '#a855f7', icon: 'shopping' },
  { id: 'cat-housing', name: 'Rent & Housing', type: 'expense', budget: 1200, color: '#3b82f6', icon: 'housing' },
  { id: 'cat-transport', name: 'Transport', type: 'expense', budget: 150, color: '#f59e0b', icon: 'transport' },
  { id: 'cat-entertainment', name: 'Entertainment', type: 'expense', budget: 150, color: '#ec4899', icon: 'entertainment' },
  { id: 'cat-utilities', name: 'Bills & Utilities', type: 'expense', budget: 300, color: '#06b6d4', icon: 'utilities' },
  
  { id: 'cat-salary', name: 'Salary', type: 'income', budget: 0, color: '#10b981', icon: 'salary' },
  { id: 'cat-freelance', name: 'Freelance Work', type: 'income', budget: 0, color: '#10b981', icon: 'freelance' },
  { id: 'cat-investments', name: 'Investments', type: 'income', budget: 0, color: '#3b82f6', icon: 'investments' },
  { id: 'cat-other-income', name: 'Other Income', type: 'income', budget: 0, color: '#64748b', icon: 'other' }
];

// Inline SVGs for rendering categories and transactional icons
const ICONS = {
  food: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  shopping: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  housing: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  transport: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
  entertainment: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="3" rx="2.1"/><path d="M17 21H7a2 2 0 0 1-2-2v-1h14v1a2 2 0 0 1-2 2Z"/></svg>`,
  utilities: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/></svg>`,
  
  salary: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>`,
  freelance: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>`,
  investments: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  other: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  
  // Extra default if icon not found
  default: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`
};

function getIconSvg(iconName) {
  return ICONS[iconName] || ICONS.default;
}

// Generate beautiful pre-populated transactions for the current month so the UI looks active
function getMockTransactions(baseDate) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  
  // Format dates within the current month
  const d1 = new Date(year, month, 5).toISOString().split('T')[0];
  const d2 = new Date(year, month, 12).toISOString().split('T')[0];
  const d3 = new Date(year, month, 18).toISOString().split('T')[0];
  const d4 = new Date(year, month, 22).toISOString().split('T')[0];
  const d5 = new Date(year, month, 25).toISOString().split('T')[0];

  return [
    { id: 'tx-1', amount: 3500, type: 'income', categoryId: 'cat-salary', desc: 'Monthly Salary Payment', date: d1 },
    { id: 'tx-2', amount: 120.50, type: 'expense', categoryId: 'cat-food', desc: 'Weekly Grocery Store Purchase', date: d2 },
    { id: 'tx-3', amount: 45, type: 'expense', categoryId: 'cat-transport', desc: 'Fuel and Highway Tolls', date: d3 },
    { id: 'tx-4', amount: 650, type: 'income', categoryId: 'cat-freelance', desc: 'Mobile UI Client Design Work', date: d4 },
    { id: 'tx-5', amount: 89.99, type: 'expense', categoryId: 'cat-shopping', desc: 'New Wireless Headphones', date: d5 }
  ];
}

// --- INITIALIZATION ---
function initApp() {
  // Load settings
  const savedSettings = localStorage.getItem('budgetflow_settings');
  if (savedSettings) {
    state.settings = JSON.parse(savedSettings);
  }
  
  // Load categories
  const savedCategories = localStorage.getItem('budgetflow_categories');
  if (savedCategories) {
    state.categories = JSON.parse(savedCategories);
  } else {
    state.categories = [...DEFAULT_CATEGORIES];
    localStorage.setItem('budgetflow_categories', JSON.stringify(state.categories));
  }

  // Load transactions
  const savedTransactions = localStorage.getItem('budgetflow_transactions');
  if (savedTransactions) {
    state.transactions = JSON.parse(savedTransactions);
  } else {
    // Generate mock transactions relative to today's date
    state.transactions = getMockTransactions(new Date());
    localStorage.setItem('budgetflow_transactions', JSON.stringify(state.transactions));
  }

  // Setup time display
  updateStatusTime();
  setInterval(updateStatusTime, 30000); // Update every 30s
  
  // Setup inputs default date
  document.getElementById('tx-date').value = new Date().toISOString().split('T')[0];

  // Apply preferences
  applyTheme(state.settings.darkMode);
  document.getElementById('theme-toggle').checked = state.settings.darkMode;
  document.getElementById('currency-select').value = state.settings.currency;
  
  // Bind listeners
  setupEventListeners();

  // Initial Render
  positionTabIndicator();
  renderActiveView();
}

function updateStatusTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
  document.getElementById('status-time').textContent = timeStr;
}

// --- DOM METRIC RENDERERS ---
function renderActiveView() {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const displayMonthStr = `${monthNames[state.currentMonth.getMonth()]} ${state.currentMonth.getFullYear()}`;
  document.getElementById('current-month-display').textContent = displayMonthStr;

  // Render sub-pages depending on selection
  if (state.activeTab === 'spending') {
    renderDashboard();
  } else if (state.activeTab === 'transactions') {
    renderTransactionsPage();
  } else if (state.activeTab === 'categories') {
    renderCategoriesPage();
  }
}

// Format currency display based on app configuration
function formatVal(amount) {
  return `${state.settings.currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Render Dashboard (Spending View)
function renderDashboard() {
  const currentMonthTx = getFilteredMonthTransactions();
  
  let incomeTotal = 0;
  let expenseTotal = 0;

  currentMonthTx.forEach(tx => {
    if (tx.type === 'income') {
      incomeTotal += tx.amount;
    } else {
      expenseTotal += tx.amount;
    }
  });

  const balanceTotal = incomeTotal - expenseTotal;

  // Set amounts
  document.getElementById('balance-amount').textContent = formatVal(balanceTotal);
  document.getElementById('income-amount').innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="color: #34d399;"><path d="m19 12-7-7-7 7"/><path d="M12 5v14"/></svg>
    ${formatVal(incomeTotal)}
  `;
  document.getElementById('expense-amount').innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="color: #fb7185;"><path d="m5 12 7 7 7-7"/><path d="M12 5v14"/></svg>
    ${formatVal(expenseTotal)}
  `;

  // Greeting dynamic hourly adjustments
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning!' : hour < 18 ? 'Good Afternoon!' : 'Good Evening!';
  document.getElementById('greeting-lbl').textContent = greeting;

  // Render recent spending transactions (cap at 4 items)
  const spendingList = document.getElementById('spending-tx-list');
  spendingList.innerHTML = '';

  // Sort descending by date
  const sortedTx = [...currentMonthTx].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentTx = sortedTx.slice(0, 4);

  if (recentTx.length === 0) {
    spendingList.innerHTML = `
      <div class="empty-state">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z"/></svg>
        <p>No transactions listed this month.<br>Add an income or expense to get started!</p>
      </div>
    `;
    return;
  }

  recentTx.forEach(tx => {
    const cat = state.categories.find(c => c.id === tx.categoryId) || { color: '#64748b', icon: 'default', name: 'Other' };
    const dateFormatted = new Date(tx.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    
    const div = document.createElement('div');
    div.className = 'transaction-item';
    div.innerHTML = `
      <div class="tx-icon-wrapper" style="background-color: ${cat.color}15; color: ${cat.color};">
        ${getIconSvg(cat.icon)}
      </div>
      <div class="tx-info">
        <div class="tx-name">${escapeHTML(tx.desc)}</div>
        <div class="tx-meta">${escapeHTML(cat.name)} &bull; ${dateFormatted}</div>
      </div>
      <div class="tx-amount ${tx.type}">
        ${tx.type === 'income' ? '+' : '-'}${formatVal(tx.amount)}
      </div>
      <button class="tx-delete-btn" data-id="${tx.id}" aria-label="Delete transaction">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
      </button>
    `;
    
    // Bind delete event directly
    div.querySelector('.tx-delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTransaction(tx.id);
    });

    spendingList.appendChild(div);
  });
}

// Render Transactions Page (Full Search/Filter View)
function renderTransactionsPage() {
  const listElement = document.getElementById('full-tx-list');
  const searchVal = document.getElementById('search-tx').value.toLowerCase().trim();
  const filterType = document.querySelector('.filter-chip.active').dataset.filter;

  listElement.innerHTML = '';

  // Get active month transactions
  let filtered = getFilteredMonthTransactions();

  // Apply search query
  if (searchVal) {
    filtered = filtered.filter(tx => tx.desc.toLowerCase().includes(searchVal));
  }

  // Apply chips filters
  if (filterType !== 'all') {
    filtered = filtered.filter(tx => tx.type === filterType);
  }

  // Sort descending by date
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    listElement.innerHTML = `
      <div class="empty-state">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <p>No matching transactions found.<br>Try relaxing your filters or description.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(tx => {
    const cat = state.categories.find(c => c.id === tx.categoryId) || { color: '#64748b', icon: 'default', name: 'Other' };
    const dateFormatted = new Date(tx.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

    const div = document.createElement('div');
    div.className = 'transaction-item';
    div.innerHTML = `
      <div class="tx-icon-wrapper" style="background-color: ${cat.color}15; color: ${cat.color};">
        ${getIconSvg(cat.icon)}
      </div>
      <div class="tx-info">
        <div class="tx-name">${escapeHTML(tx.desc)}</div>
        <div class="tx-meta">${escapeHTML(cat.name)} &bull; ${dateFormatted}</div>
      </div>
      <div class="tx-amount ${tx.type}">
        ${tx.type === 'income' ? '+' : '-'}${formatVal(tx.amount)}
      </div>
      <button class="tx-delete-btn" data-id="${tx.id}" aria-label="Delete transaction">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
      </button>
    `;

    div.querySelector('.tx-delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTransaction(tx.id);
    });

    listElement.appendChild(div);
  });
}

// Render Categories Page with Progress Indicators
function renderCategoriesPage() {
  const container = document.getElementById('category-summary-container');
  container.innerHTML = '';

  const currentMonthTx = getFilteredMonthTransactions();
  
  // Calculate expenses by category
  const totals = {};
  state.categories.forEach(c => {
    if (c.type === 'expense') totals[c.id] = 0;
  });

  currentMonthTx.forEach(tx => {
    if (tx.type === 'expense' && totals.hasOwnProperty(tx.categoryId)) {
      totals[tx.categoryId] += tx.amount;
    }
  });

  // Filter custom categories of type expense
  const expenseCategories = state.categories.filter(c => c.type === 'expense');

  expenseCategories.forEach(cat => {
    const totalSpent = totals[cat.id] || 0;
    const limit = cat.budget || 0;
    
    let percent = 0;
    let limitLabel = 'No budget limit set';
    let progressColor = cat.color;

    if (limit > 0) {
      percent = Math.min((totalSpent / limit) * 100, 100);
      limitLabel = `Limit: ${formatVal(limit)}`;
      // Turn progress bar indicator red if spending exceeds budget limit
      if (totalSpent > limit) {
        progressColor = 'var(--danger)';
      }
    }

    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
      <div class="category-header">
        <div class="category-meta">
          <div class="category-icon" style="background-color: ${cat.color}15; color: ${cat.color};">
            ${getIconSvg(cat.icon)}
          </div>
          <span class="category-title">${escapeHTML(cat.name)}</span>
        </div>
        <span class="category-total">${formatVal(totalSpent)}</span>
      </div>
      
      <div class="category-progress-container">
        <div class="category-progress-bar" style="background-color: ${progressColor}; width: 0%;"></div>
      </div>
      
      <div class="category-details-row">
        <span>${limitLabel}</span>
        <span>${limit > 0 ? Math.round((totalSpent / limit) * 100) + '%' : ''}</span>
      </div>
    `;

    container.appendChild(card);

    // Micro-animation delay wrapper to trigger widths fluidly
    setTimeout(() => {
      const bar = card.querySelector('.category-progress-bar');
      if (bar) bar.style.width = `${percent}%`;
    }, 50);
  });
}

// --- FILTERING UTIL ---
function getFilteredMonthTransactions() {
  const year = state.currentMonth.getFullYear();
  const month = state.currentMonth.getMonth();
  
  return state.transactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getFullYear() === year && txDate.getMonth() === month;
  });
}

// --- MUTATIONS ---
function addTransaction(amount, categoryId, date, desc, type) {
  const newTx = {
    id: 'tx-' + Date.now(),
    amount: parseFloat(amount),
    categoryId,
    date,
    desc: desc.trim(),
    type
  };

  state.transactions.push(newTx);
  localStorage.setItem('budgetflow_transactions', JSON.stringify(state.transactions));
  
  showToast(`${type === 'income' ? 'Income' : 'Expense'} added successfully`, 'success');
  renderActiveView();
}

function deleteTransaction(id) {
  const index = state.transactions.findIndex(tx => tx.id === id);
  if (index !== -1) {
    const type = state.transactions[index].type;
    state.transactions.splice(index, 1);
    localStorage.setItem('budgetflow_transactions', JSON.stringify(state.transactions));
    showToast(`Transaction deleted`, 'success');
    renderActiveView();
  }
}

function addCategory(name, budget, color) {
  const id = 'cat-' + Date.now();
  const newCat = {
    id,
    name: name.trim(),
    type: 'expense',
    budget: budget ? parseFloat(budget) : 0,
    color,
    icon: 'default'
  };

  state.categories.push(newCat);
  localStorage.setItem('budgetflow_categories', JSON.stringify(state.categories));
  
  showToast(`Category "${name}" created`, 'success');
  renderCategoriesPage();
}

// --- UI UTILS & EVENT HANDLERS ---
function setupEventListeners() {
  
  // Navigation Tabs Switch
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const targetTab = e.currentTarget.dataset.tab;
      switchTab(targetTab);
    });
  });

  // See All recent transactions link
  document.getElementById('link-see-all').addEventListener('click', () => {
    switchTab('transactions');
  });

  // Date manipulation buttons
  document.getElementById('prev-month').addEventListener('click', () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() - 1);
    renderActiveView();
  });
  
  document.getElementById('next-month').addEventListener('click', () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() + 1);
    renderActiveView();
  });

  // Launch Add Modals
  document.getElementById('btn-add-expense').addEventListener('click', () => {
    openTransactionSheet('expense');
  });

  document.getElementById('btn-add-income').addEventListener('click', () => {
    openTransactionSheet('income');
  });

  // Close sheet events
  document.getElementById('btn-close-sheet').addEventListener('click', closeTransactionSheet);
  document.getElementById('modal-overlay').addEventListener('click', closeTransactionSheet);

  // Submit transaction form
  document.getElementById('transaction-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = document.getElementById('tx-amount').value;
    const categoryId = getSelectedPickerCategory();
    const date = document.getElementById('tx-date').value;
    const desc = document.getElementById('tx-desc').value;
    const type = document.getElementById('tx-type').value;

    if (!categoryId) {
      showToast('Please select a category', 'error');
      return;
    }

    addTransaction(amount, categoryId, date, desc, type);
    closeTransactionSheet();
  });

  // Search filter typing binding
  document.getElementById('search-tx').addEventListener('input', renderTransactionsPage);

  // Chips filters binding
  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      chips.forEach(c => c.classList.remove('active'));
      e.currentTarget.classList.add('active');
      renderTransactionsPage();
    });
  });

  // Add custom category submit form
  document.getElementById('new-category-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('new-cat-name').value;
    const budget = document.getElementById('new-cat-budget').value;
    const selectedColorEl = document.querySelector('.color-option.selected');
    const color = selectedColorEl ? selectedColorEl.dataset.color : '#6366f1';

    addCategory(name, budget, color);
    
    // Reset Form
    document.getElementById('new-category-form').reset();
    // Re-select standard default color picker
    document.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
    document.getElementById('color-options-wrapper').firstElementChild.classList.add('selected');
  });

  // Category Form color palette switcher selection
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
      colorOptions.forEach(o => o.classList.remove('selected'));
      e.currentTarget.classList.add('selected');
    });
  });

  // Dark theme toggles
  document.getElementById('theme-toggle').addEventListener('change', (e) => {
    const isDark = e.target.checked;
    state.settings.darkMode = isDark;
    localStorage.setItem('budgetflow_settings', JSON.stringify(state.settings));
    applyTheme(isDark);
  });

  // Currency toggles
  document.getElementById('currency-select').addEventListener('change', (e) => {
    state.settings.currency = e.target.value;
    localStorage.setItem('budgetflow_settings', JSON.stringify(state.settings));
    document.getElementById('amount-currency-label').textContent = state.settings.currency;
    renderActiveView();
  });

  // Clear state reset values
  document.getElementById('btn-clear-data').addEventListener('click', () => {
    if (confirm('Are you absolutely sure you want to reset all transaction history and custom configurations?')) {
      localStorage.removeItem('budgetflow_transactions');
      localStorage.removeItem('budgetflow_categories');
      localStorage.removeItem('budgetflow_settings');
      
      showToast('Data reset successful. Reloading...', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  });
}

// Switch tabs and slide floating indicators
function switchTab(tabId) {
  state.activeTab = tabId;
  
  // Views toggle classes active
  const views = document.querySelectorAll('.view');
  views.forEach(view => {
    view.classList.remove('active');
  });
  document.getElementById(`view-${tabId}`).classList.add('active');

  // Nav buttons toggle classes active
  const navButtons = document.querySelectorAll('.nav-item');
  navButtons.forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.getElementById(`nav-btn-${tabId}`);
  activeBtn.classList.add('active');

  positionTabIndicator();
  renderActiveView();
}

// Calculate bounding boxes and position the indicator pill under active elements
function positionTabIndicator() {
  const activeBtn = document.getElementById(`nav-btn-${state.activeTab}`);
  const indicator = document.getElementById('nav-indicator');
  
  if (activeBtn && indicator) {
    const parentRect = activeBtn.parentElement.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    
    const leftOffset = btnRect.left - parentRect.left;
    indicator.style.left = `${leftOffset}px`;
    indicator.style.width = `${btnRect.width}px`;
  }
}

// On window resize reposition the floating indicator
window.addEventListener('resize', positionTabIndicator);

// Apply style attributes to base layout
function applyTheme(isDark) {
  const html = document.documentElement;
  if (isDark) {
    html.setAttribute('data-theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
  }
}

// Toast alerts scheduler logic
let toastTimeout;
function showToast(message, type = 'success') {
  const toast = document.getElementById('app-toast');
  const icon = document.getElementById('toast-icon');
  const msgEl = document.getElementById('toast-message');

  clearTimeout(toastTimeout);

  toast.className = `toast active ${type}`;
  msgEl.textContent = message;

  if (type === 'success') {
    icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else {
    icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// Modal sheets toggle states
function openTransactionSheet(type) {
  document.getElementById('tx-type').value = type;
  document.getElementById('sheet-action-title').textContent = type === 'income' ? 'Add Income' : 'Add Expense';
  document.getElementById('btn-save-transaction').textContent = type === 'income' ? 'Add Income' : 'Add Expense';
  
  // Apply visual styling to Save button matches type
  const submitBtn = document.getElementById('btn-save-transaction');
  if (type === 'income') {
    submitBtn.style.backgroundColor = 'var(--success)';
    submitBtn.style.boxShadow = '0 4px 10px var(--success-glow)';
  } else {
    submitBtn.style.backgroundColor = 'var(--danger)';
    submitBtn.style.boxShadow = '0 4px 10px var(--danger-glow)';
  }

  document.getElementById('amount-currency-label').textContent = state.settings.currency;
  
  // Render categories for the grid picker based on income/expense type
  renderCategoryPicker(type);

  // Reset inputs
  document.getElementById('tx-amount').value = '';
  document.getElementById('tx-desc').value = '';
  document.getElementById('tx-date').value = new Date().toISOString().split('T')[0];

  // Turn active classes on overlay and sheet
  document.getElementById('modal-overlay').classList.add('active');
  document.getElementById('transaction-sheet').classList.add('active');
}

function closeTransactionSheet() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.getElementById('transaction-sheet').classList.remove('active');
}

// Render dynamic picker icons in grid sheet
function renderCategoryPicker(type) {
  const pickerGrid = document.getElementById('category-picker-grid');
  pickerGrid.innerHTML = '';

  const relevantCats = state.categories.filter(c => c.type === type);

  relevantCats.forEach((cat, idx) => {
    const item = document.createElement('div');
    item.className = `picker-item ${idx === 0 ? 'selected' : ''}`;
    item.dataset.id = cat.id;
    item.innerHTML = `
      <div class="picker-icon-wrapper" style="background-color: ${cat.color}15; color: ${cat.color};">
        ${getIconSvg(cat.icon)}
      </div>
      <span class="picker-label">${escapeHTML(cat.name)}</span>
    `;

    item.addEventListener('click', (e) => {
      document.querySelectorAll('.picker-item').forEach(p => p.classList.remove('selected'));
      e.currentTarget.classList.add('selected');
    });

    pickerGrid.appendChild(item);
  });
}

function getSelectedPickerCategory() {
  const selectedEl = document.querySelector('.picker-item.selected');
  return selectedEl ? selectedEl.dataset.id : null;
}

// --- UTILS ---
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Let transactions trigger on window loaded
window.addEventListener('DOMContentLoaded', initApp);
