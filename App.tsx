import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExpensesScreen } from './src/screens/ExpensesScreen';
import { ReviewReceiptScreen } from './src/screens/ReviewReceiptScreen';
import { ExpenseRecord, ExtractionResult } from './src/types/expense';

export default function App() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
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
