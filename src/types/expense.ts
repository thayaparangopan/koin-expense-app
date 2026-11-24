export type Category =
  | 'Food & Dining'
  | 'Groceries'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Other';

export interface ReceiptItem {
  id: string;
  name: string;
  priceCents: number; // Integer-based currency (e.g. 1400 = $14.00)
}

export interface ExpenseRecord {
  id: string;
  merchant: string;
  date: string; // e.g. "Nov 24, 2026"
  timestampDisplay: string; // e.g. "Today, 10:42 AM" or "Nov 22, 2026"
  category: Category;
  totalCents: number;
  items: ReceiptItem[];
  receiptImageUri?: string;
}

export interface ExtractionResult {
  merchant: string;
  date: string;
  category: Category;
  items: ReceiptItem[];
  imageUri?: string;
}
