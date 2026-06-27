# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx expo start --lan    # Start dev server on LAN (scan QR with Expo Go on same WiFi)
npx expo start --android
npx expo start --ios
```

The `web/` directory contains the original HTML/CSS/JS prototype — it is not served or used by the React Native app.

## Architecture

**Entry:** `index.js` → `App.js` → `AppProvider` wraps everything → `NavigationContainer` → bottom tab navigator.

**State layer (`src/AppContext.js`):** Single `useReducer` store for `transactions`, `categories`, `settings`, and `currentMonth`. All mutations (add/edit/delete transaction, add category, update settings, reset) are defined here and immediately persist to AsyncStorage. Consume via `useApp()`.

**Theme system:** `src/theme.js` exports `lightTheme` and `darkTheme` token objects. `AppContext` computes `theme` from `state.settings.darkMode` and exposes it via context. Every screen and component must import `theme` from `useApp()` and apply it through inline styles — there are no StyleSheet-level theme variables.

**Persistence (`src/storage.js`):** Thin AsyncStorage wrappers keyed at `budgetflow_transactions`, `budgetflow_categories`, `budgetflow_settings`. On first launch, categories and mock transactions are seeded and saved.

**Screens (`src/screens/`):**
- `SpendingScreen` — monthly summary with gradient balance card, income/expense totals, budget progress bars
- `TransactionsScreen` — filterable transaction list with swipe-to-delete
- `CategoriesScreen` — category list with budget usage; add new category via modal
- `SettingsScreen` — currency toggle, dark mode switch, reset all data

**Components (`src/components/`):**
- `AddTransactionModal` — shared modal for add and edit flows; receives `editingTx` prop to pre-fill
- `TransactionItem` — row with swipe gesture; pencil icon opens edit modal
- `Toast` — imperative via `registerToast` ref pattern in `AppContext`

**Navigation:** `@react-navigation/bottom-tabs` v7. Tab icons use a fixed 44×30 `iconContainer` view to prevent React Navigation from clipping the icon highlight background.

## Key conventions

- `@expo/vector-icons` Ionicons for all icons; category icons are Ionicons name strings stored in category objects.
- `@react-native-community/datetimepicker` for date selection in the transaction modal (inline on iOS, dialog on Android).
- `expo-linear-gradient` used on the balance card, modal header, and primary buttons.
- `useSafeAreaInsets` from `react-native-safe-area-context` used in all screens for proper inset handling.
- Transaction `date` is stored as an ISO date string (`YYYY-MM-DD`).
- `formatVal(amount)` on the context formats currency using `settings.currency` prefix.
