import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Category } from '../types/expense';

interface CategoryPickerModalProps {
  visible: boolean;
  selectedCategory: Category;
  onSelect: (category: Category) => void;
  onClose: () => void;
}

const CATEGORIES: { label: Category; icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }[] = [
  {
    label: 'Food & Dining',
    icon: 'cafe-outline',
    color: theme.colors.categories.food.text,
    bg: theme.colors.categories.food.bg,
  },
  {
    label: 'Groceries',
    icon: 'basket-outline',
    color: theme.colors.categories.groceries.text,
    bg: theme.colors.categories.groceries.bg,
  },
  {
    label: 'Transport',
    icon: 'car-outline',
    color: theme.colors.categories.transport.text,
    bg: theme.colors.categories.transport.bg,
  },
  {
    label: 'Shopping',
    icon: 'bag-handle-outline',
    color: theme.colors.categories.shopping.text,
    bg: theme.colors.categories.shopping.bg,
  },
  {
    label: 'Entertainment',
    icon: 'film-outline',
    color: theme.colors.categories.entertainment.text,
    bg: theme.colors.categories.entertainment.bg,
  },
  {
    label: 'Other',
    icon: 'grid-outline',
    color: theme.colors.textSecondary,
    bg: theme.colors.cardWarm,
  },
];

export const CategoryPickerModal: React.FC<CategoryPickerModalProps> = ({
  visible,
  selectedCategory,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.header}>
                <Text style={styles.title}>Select Category</Text>
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close-circle" size={24} color={theme.colors.textPlaceholder} />
                </TouchableOpacity>
              </View>

              <View style={styles.categoryList}>
                {CATEGORIES.map((item) => {
                  const isSelected = selectedCategory === item.label;
                  return (
                    <TouchableOpacity
                      key={item.label}
                      style={[
                        styles.categoryItem,
                        isSelected && styles.selectedCategoryItem,
                      ]}
                      onPress={() => {
                        onSelect(item.label);
                        onClose();
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                        <Ionicons name={item.icon} size={20} color={item.color} />
                      </View>
                      <Text
                        style={[
                          styles.categoryLabel,
                          isSelected && styles.selectedCategoryLabel,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={theme.colors.primary}
                          style={styles.checkmark}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 19, 43, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1ECE5',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  categoryList: {
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  selectedCategoryItem: {
    backgroundColor: theme.colors.primaryLight,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  selectedCategoryLabel: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  checkmark: {
    marginLeft: 8,
  },
});
