# BudgetFlow – Expense Tracker

A mobile expense tracker built with Expo / React Native. Track income and expenses by category, visualise monthly spending, manage budgets, and toggle dark mode — all data stored locally on device.

## Screenshots

| Spending | Transactions | Categories | Settings |
|----------|-------------|------------|----------|
| Balance card with gradient, income/expense totals, budget progress bars | Filterable list with swipe-to-delete and inline edit | Per-category budget usage with colour indicators | Currency, dark mode, and data reset |

## Features

- **Monthly overview** — gradient balance card showing net balance, total income, and total expenses for the selected month
- **Budget tracking** — per-category budget limits with progress bars on the Categories screen
- **Add / Edit / Delete transactions** — native date picker, category selector, amount and description fields
- **Dark mode** — full dark theme toggled instantly from Settings
- **Persistent storage** — all data saved locally via AsyncStorage (no account or backend required)

## Tech Stack

| Package | Version |
|---------|---------|
| Expo SDK | ~54.0.0 |
| React Native | 0.81.5 |
| React | 19.1.0 |
| @react-navigation/bottom-tabs | ^7.0.0 |
| expo-linear-gradient | ~15.0.8 |
| @react-native-async-storage/async-storage | ^2.1.0 |
| @react-native-community/datetimepicker | 8.4.4 |

## Getting Started

### Prerequisites

- Node.js 18+
- [Expo Go](https://expo.dev/client) app on your iOS or Android device

### Run locally

```bash
npm install
npx expo start --lan
```

Scan the QR code with Expo Go (device must be on the same WiFi network).

To target a specific platform:

```bash
npx expo start --android
npx expo start --ios
```

## Project Structure

```
├── App.js                  # Root component — navigation + tab bar
├── index.js                # Expo entry point
├── src/
│   ├── AppContext.js        # Global state (useReducer) + all data mutations
│   ├── theme.js            # lightTheme / darkTheme color token objects
│   ├── constants.js        # DEFAULT_CATEGORIES, COLORS, getMockTransactions
│   ├── storage.js          # AsyncStorage read/write helpers
│   ├── screens/
│   │   ├── SpendingScreen.js
│   │   ├── TransactionsScreen.js
│   │   ├── CategoriesScreen.js
│   │   └── SettingsScreen.js
│   └── components/
│       ├── AddTransactionModal.js   # Shared add + edit modal
│       ├── TransactionItem.js       # Row with swipe-to-delete + edit button
│       └── Toast.js
├── assets/                 # App icon, splash, favicon
└── web/                    # Original HTML/CSS/JS prototype (reference only)
```

## License

MIT
