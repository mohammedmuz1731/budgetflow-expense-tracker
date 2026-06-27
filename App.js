import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { AppProvider, useApp } from './src/AppContext';
import SpendingScreen from './src/screens/SpendingScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import Toast from './src/components/Toast';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Spending:     { active: 'wallet',        inactive: 'wallet-outline' },
  Transactions: { active: 'swap-vertical', inactive: 'swap-vertical-outline' },
  Categories:   { active: 'pie-chart',     inactive: 'pie-chart-outline' },
  Settings:     { active: 'settings',      inactive: 'settings-outline' },
};

function AppTabs() {
  const { theme } = useApp();

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.tabBar,
            borderTopWidth: 0,
            height: 80,
            paddingTop: 6,
            paddingBottom: 14,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: theme.isDark ? 0.4 : 0.06,
            shadowRadius: 16,
            elevation: 12,
          },
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: theme.textMuted,
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: styles.tabItem,
          tabBarIcon: ({ focused, color }) => {
            const icon = focused ? TAB_ICONS[route.name].active : TAB_ICONS[route.name].inactive;
            return (
              <View style={[styles.iconContainer, focused && { backgroundColor: theme.badgeBg }]}>
                <Ionicons name={icon} size={22} color={color} />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Spending" component={SpendingScreen} />
        <Tab.Screen name="Transactions" component={TransactionsScreen} />
        <Tab.Screen name="Categories" component={CategoriesScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      <Toast />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <AppInner />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppInner() {
  const { theme } = useApp();
  const navTheme = theme.isDark
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: theme.bg } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: theme.bg } };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <AppTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tabItem: { paddingTop: 2 },
  tabLabel: { fontSize: 11, fontWeight: '700', marginTop: 2, marginBottom: 0 },
  iconContainer: {
    width: 44,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
