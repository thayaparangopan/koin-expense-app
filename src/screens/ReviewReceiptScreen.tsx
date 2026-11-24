import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { ReceiptItemRow } from '../components/ReceiptItem';
import { CategoryPickerModal } from '../components/CategoryPickerModal';
import {
  ExtractionResult,
  ExpenseRecord,
  ReceiptItem,
  Category,
} from '../types/expense';
import { formatCents, calculateTotalCents } from '../utils/currency';

interface ReviewReceiptScreenProps {
  initialData: ExtractionResult;
  onBack: () => void;
  onSaveExpense: (expense: ExpenseRecord) => void;
}

export const ReviewReceiptScreen: React.FC<ReviewReceiptScreenProps> = ({
  initialData,
  onBack,
  onSaveExpense,
}) => {
  const [merchant, setMerchant] = useState(initialData.merchant || 'Cafe Kumbuk');
  const [isEditingMerchant, setIsEditingMerchant] = useState(false);
  const [date, setDate] = useState(initialData.date || 'Nov 24, 2026');
  const [category, setCategory] = useState<Category>(
    initialData.category || 'Food & Dining'
  );
  const [items, setItems] = useState<ReceiptItem[]>(initialData.items || []);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  // Dynamic integer-based total
  const totalCents = calculateTotalCents(items);

  const handleUpdateItemName = (id: string, name: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name } : item))
    );
  };

  const handleUpdateItemPrice = (id: string, priceCents: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, priceCents } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    const newItem: ReceiptItem = {
      id: `item-${Date.now()}-${items.length + 1}`,
      name: 'New item',
      priceCents: 500, // default $5.00
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleConfirmSave = () => {
    // Validation
    const cleanMerchant = merchant.trim();
    if (!cleanMerchant) {
      Alert.alert('Validation Error', 'Please enter a valid merchant name.');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Validation Error', 'Please include at least one expense item.');
      return;
    }

    const hasInvalidItem = items.some(
      (it) => !it.name.trim() || it.priceCents <= 0
    );
    if (hasInvalidItem) {
      Alert.alert(
        'Validation Error',
        'All items must have a name and a price greater than $0.00.'
      );
      return;
    }

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const timestampDisplay = `Today, ${formattedHours}:${minutes} ${ampm}`;

    const newExpense: ExpenseRecord = {
      id: `expense-${Date.now()}`,
      merchant: cleanMerchant,
      date,
      timestampDisplay,
      category,
      totalCents,
      items,
      receiptImageUri: initialData.imageUri,
    };

    onSaveExpense(newExpense);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.navTitle}>Review Receipt</Text>

          {/* Receipt badge icon */}
          <View style={styles.receiptBadge}>
            <Ionicons name="receipt" size={22} color="#1E293B" />
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Merchant Card */}
          <View style={styles.merchantCard}>
            {/* Merchant Name Row */}
            <View style={styles.merchantHeaderRow}>
              <View style={styles.merchantLabelContainer}>
                <Text style={styles.cardLabel}>Merchant Name</Text>
                {isEditingMerchant ? (
                  <TextInput
                    style={styles.merchantInput}
                    value={merchant}
                    onChangeText={setMerchant}
                    onBlur={() => setIsEditingMerchant(false)}
                    autoFocus
                    placeholder="Merchant name"
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => setIsEditingMerchant(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.merchantName}>{merchant}</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                onPress={() => setIsEditingMerchant((prev) => !prev)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={isEditingMerchant ? 'checkmark' : 'create-outline'}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.cardDivider} />

            {/* Date & Category Row */}
            <View style={styles.metaRow}>
              {/* Date */}
              <View style={styles.metaColumn}>
                <Text style={styles.cardLabel}>Date</Text>
                <View style={styles.dateRow}>
                  <Text style={styles.dateText}>{date}</Text>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={theme.colors.textSecondary}
                    style={styles.dateIcon}
                  />
                </View>
              </View>

              {/* Category */}
              <View style={styles.metaColumnRight}>
                <Text style={styles.cardLabel}>Category</Text>
                <TouchableOpacity
                  style={styles.categoryPill}
                  onPress={() => setIsCategoryModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryPillText}>{category}</Text>
                  <Ionicons
                    name="chevron-down"
                    size={14}
                    color={theme.colors.primary}
                    style={styles.chevronIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Extracted Items Section */}
          <View style={styles.itemsSectionHeader}>
            <Text style={styles.itemsSectionTitle}>Extracted Items</Text>
            <Text style={styles.itemsCountText}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Text>
          </View>

          {/* Line Items List */}
          <View style={styles.itemsListContainer}>
            {items.map((item, index) => (
              <ReceiptItemRow
                key={item.id}
                item={item}
                onUpdateName={handleUpdateItemName}
                onUpdatePrice={handleUpdateItemPrice}
                onDelete={handleDeleteItem}
                isLast={index === items.length - 1}
              />
            ))}
          </View>

          {/* Add Item Button */}
          <TouchableOpacity
            style={styles.addItemButton}
            onPress={handleAddItem}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color={theme.colors.primary} />
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>

          {/* Quick Check Helper Text */}
          <View style={styles.checkHelperRow}>
            <Ionicons
              name="checkmark"
              size={16}
              color={theme.colors.textSecondary}
              style={styles.checkIcon}
            />
            <Text style={styles.checkHelperText}>
              All set? Give your items a quick check.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Fixed Total & Action Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>{formatCents(totalCents)}</Text>
            </View>

            <View style={styles.totalItemCountBadge}>
              <Ionicons
                name="checkmark"
                size={16}
                color={theme.colors.primary}
                style={styles.totalCheckIcon}
              />
              <Text style={styles.totalItemCountText}>
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmSave}
            activeOpacity={0.8}
          >
            <Ionicons
              name="checkmark"
              size={20}
              color={theme.colors.textWhite}
              style={styles.confirmButtonIcon}
            />
            <Text style={styles.confirmButtonText}>Confirm & Save Expense</Text>
          </TouchableOpacity>
        </View>

        {/* Category Selection Modal */}
        <CategoryPickerModal
          visible={isCategoryModalVisible}
          selectedCategory={category}
          onSelect={setCategory}
          onClose={() => setIsCategoryModalVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    flex: 1,
    marginLeft: 8,
  },
  receiptBadge: {
    width: 36,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  merchantCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 18,
    ...theme.shadows.card,
    marginBottom: 24,
  },
  merchantHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  merchantLabelContainer: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  merchantName: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  merchantInput: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1ECE5',
    marginVertical: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaColumn: {
    flex: 1,
  },
  metaColumnRight: {
    alignItems: 'flex-start',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  dateIcon: {
    marginLeft: 6,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  chevronIcon: {
    marginLeft: 4,
  },
  itemsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemsSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  itemsCountText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  itemsListContainer: {
    marginBottom: 12,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    alignSelf: 'flex-start',
    gap: 6,
  },
  addItemText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  checkHelperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
  checkIcon: {
    marginRight: 6,
  },
  checkHelperText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  bottomBar: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 12 : 20,
    ...theme.shadows.card,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  totalItemCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  totalCheckIcon: {
    marginRight: 4,
  },
  totalItemCountText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  confirmButtonIcon: {
    marginRight: 2,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textWhite,
  },
});
