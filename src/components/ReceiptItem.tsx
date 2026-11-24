import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { ReceiptItem } from '../types/expense';
import { centsToInputString, parseInputToCents } from '../utils/currency';

interface ReceiptItemProps {
  item: ReceiptItem;
  onUpdateName: (id: string, name: string) => void;
  onUpdatePrice: (id: string, priceCents: number) => void;
  onDelete: (id: string) => void;
  isLast?: boolean;
}

export const ReceiptItemRow: React.FC<ReceiptItemProps> = ({
  item,
  onUpdateName,
  onUpdatePrice,
  onDelete,
  isLast = false,
}) => {
  const [priceString, setPriceString] = React.useState(
    centsToInputString(item.priceCents)
  );

  // Sync state if item price changes externally
  React.useEffect(() => {
    setPriceString(centsToInputString(item.priceCents));
  }, [item.priceCents]);

  const handlePriceChange = (val: string) => {
    setPriceString(val);
    const parsed = parseInputToCents(val);
    onUpdatePrice(item.id, parsed);
  };

  const handlePriceBlur = () => {
    // Reformat cleanly on blur
    setPriceString(centsToInputString(item.priceCents));
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Item Name Input */}
        <TextInput
          style={styles.nameInput}
          value={item.name}
          onChangeText={(val) => onUpdateName(item.id, val)}
          placeholder="Item name"
          placeholderTextColor={theme.colors.textPlaceholder}
        />

        {/* Price Input Box */}
        <View style={styles.priceBox}>
          <Text style={styles.currencySymbol}>Rs.</Text>
          <TextInput
            style={styles.priceInput}
            value={priceString}
            onChangeText={handlePriceChange}
            onBlur={handlePriceBlur}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={theme.colors.textPlaceholder}
            selectTextOnFocus
          />
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item.id)}
          activeOpacity={0.6}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.textPlaceholder} />
        </TouchableOpacity>
      </View>

      {!isLast && <View style={styles.divider} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    paddingVertical: 6,
    marginRight: 10,
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 96,
    justifyContent: 'space-between',
    marginRight: 12,
  },
  currencySymbol: {
    fontSize: 14,
    color: theme.colors.textPlaceholder,
    marginRight: 6,
    fontWeight: '500',
  },
  priceInput: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'right',
    minWidth: 42,
    padding: 0,
  },
  deleteButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    marginTop: 10,
    height: 1,
    backgroundColor: '#F1ECE5',
  },
});
