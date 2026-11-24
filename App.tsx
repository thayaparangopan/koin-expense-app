import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExpensesScreen } from './src/screens/ExpensesScreen';
import { ReviewReceiptScreen } from './src/screens/ReviewReceiptScreen';
import { ExpenseRecord, ExtractionResult } from './src/types/expense';

const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-1',
    merchant: 'Cafe Kumbuk',
    date: 'Nov 24, 2026',
    timestampDisplay: 'Today, 10:42 AM',
    category: 'Food & Dining',
    totalCents: 2850,
    items: [
      { id: 'item-1', name: 'Avocado toast', priceCents: 1400 },
      { id: 'item-2', name: 'Cappuccino', priceCents: 650 },
      { id: 'item-3', name: 'Banana pancakes', priceCents: 800 },
    ],
  },
  {
    id: 'exp-2',
    merchant: 'Keells Super',
    date: 'Nov 23, 2026',
    timestampDisplay: 'Yesterday, 6:18 PM',
    category: 'Groceries',
    totalCents: 6420,
    items: [
      { id: 'item-2-1', name: 'Organic Almond Milk', priceCents: 1250 },
      { id: 'item-2-2', name: 'Fresh Strawberries', priceCents: 890 },
      { id: 'item-2-3', name: 'Sourdough Bread', priceCents: 620 },
      { id: 'item-2-4', name: 'Greek Yogurt 500g', priceCents: 780 },
    ],
  },
  {
    id: 'exp-3',
    merchant: 'Uber',
    date: 'Nov 22, 2026',
    timestampDisplay: 'Nov 22, 2026',
    category: 'Transport',
    totalCents: 1280,
    items: [
      { id: 'item-3-1', name: 'Trip to Cafe Kumbuk', priceCents: 1280 },
    ],
  },
  {
    id: 'exp-4',
    merchant: 'The Good Market',
    date: 'Nov 21, 2026',
    timestampDisplay: 'Nov 21, 2026',
    category: 'Shopping',
    totalCents: 3500,
    items: [
      { id: 'item-4-1', name: 'Handmade Beeswax Candle', priceCents: 1800 },
      { id: 'item-4-2', name: 'Organic Ceylon Tea', priceCents: 1700 },
    ],
  },
];

export default function App() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const [currentScreen, setCurrentScreen] = useState<'expenses' | 'review'>('expenses');
  const [extractedReceipt, setExtractedReceipt] = useState<ExtractionResult | null>(null);

  const handleStartReview = (extracted: ExtractionResult) => {
    setExtractedReceipt(extracted);
    setCurrentScreen('review');
  };

  const handleBackToExpenses = () => {
    setCurrentScreen('expenses');
    setExtractedReceipt(null);
  };

  const handleSaveExpense = (newExpense: ExpenseRecord) => {
    // Add new expense to top of list
    setExpenses((prev) => [newExpense, ...prev]);
    setCurrentScreen('expenses');
    setExtractedReceipt(null);
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {currentScreen === 'review' && extractedReceipt ? (
        <ReviewReceiptScreen
          initialData={extractedReceipt}
          onBack={handleBackToExpenses}
          onSaveExpense={handleSaveExpense}
        />
      ) : (
        <ExpensesScreen
          expenses={expenses}
          onStartReview={handleStartReview}
        />
      )}
    </SafeAreaProvider>
  );
}
