import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { ExpenseRecord, Category } from '../types/expense';
import { formatCents } from '../utils/currency';

interface ExpenseItemProps {
  expense: ExpenseRecord;
  onPress?: () => void;
  isLast?: boolean;
}

const getCategoryStyle = (category: Category) => {
  switch (category) {
    case 'Food & Dining':
      return {
        bg: theme.colors.categories.food.bg,
        color: theme.colors.categories.food.text,
        icon: 'cafe-outline' as const,
      };
    case 'Groceries':
      return {
        bg: theme.colors.categories.groceries.bg,
        color: theme.colors.categories.groceries.text,
        icon: 'basket-outline' as const,
      };
    case 'Transport':
      return {
        bg: theme.colors.categories.transport.bg,
        color: theme.colors.categories.transport.text,
        icon: 'car-outline' as const,
      };
    case 'Shopping':
      return {
        bg: theme.colors.categories.shopping.bg,
        color: theme.colors.categories.shopping.text,
        icon: 'bag-handle-outline' as const,
      };
    default:
      return {
        bg: theme.colors.categories.entertainment.bg,
        color: theme.colors.categories.entertainment.text,
        icon: 'receipt-outline' as const,
      };
  }
};

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
  expense,
  onPress,
  isLast = false,
}) => {
  const catStyle = getCategoryStyle(expense.category);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={[styles.iconWrapper, { backgroundColor: catStyle.bg }]}>
        <Ionicons name={catStyle.icon} size={22} color={catStyle.color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.merchant}>{expense.merchant}</Text>
        <Text style={styles.timestamp}>{expense.timestampDisplay || expense.date}</Text>
      </View>

      <Text style={styles.amount}>{formatCents(expense.totalCents)}</Text>

      {!isLast && <View style={styles.divider} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  merchant: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  divider: {
    position: 'absolute',
    left: 60,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: '#F1ECE5',
  },
});
