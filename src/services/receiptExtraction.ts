import { ExtractionResult, Category } from '../types/expense';

/**
 * Sample receipt templates used to simulate realistic OCR scan results.
 */
const SAMPLE_RECEIPTS: ExtractionResult[] = [
  {
    merchant: 'Cafe Kumbuk',
    date: 'Nov 24, 2026',
    category: 'Food & Dining',
    items: [
      { id: 'item-1', name: 'Avocado toast', priceCents: 1400 },
      { id: 'item-2', name: 'Cappuccino', priceCents: 650 },
      { id: 'item-3', name: 'Banana pancakes', priceCents: 800 },
    ],
  },
  {
    merchant: 'Keells Super',
    date: 'Nov 24, 2026',
    category: 'Groceries',
    items: [
      { id: 'item-1', name: 'Organic Almond Milk', priceCents: 1250 },
      { id: 'item-2', name: 'Fresh Strawberries', priceCents: 890 },
      { id: 'item-3', name: 'Sourdough Bread', priceCents: 620 },
      { id: 'item-4', name: 'Greek Yogurt 500g', priceCents: 780 },
    ],
  },
  {
    merchant: 'The Good Market',
    date: 'Nov 24, 2026',
    category: 'Shopping',
    items: [
      { id: 'item-1', name: 'Handmade Beeswax Candle', priceCents: 1800 },
      { id: 'item-2', name: 'Organic Ceylon Tea', priceCents: 1700 },
    ],
  },
];

let receiptIndex = 0;

/**
 * Simulates an OCR scanning and receipt extraction service.
 * Delays for 1.2s to simulate network / ML processing.
 */
export async function extractReceiptData(imageUri?: string): Promise<ExtractionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Pick sample receipt sequentially or cycle
  const sample = SAMPLE_RECEIPTS[receiptIndex % SAMPLE_RECEIPTS.length];
  receiptIndex += 1;

  // Return deep copy with new ids and attached imageUri
  return {
    merchant: sample.merchant,
    date: sample.date,
    category: sample.category,
    imageUri,
    items: sample.items.map((item, idx) => ({
      ...item,
      id: `item-${Date.now()}-${idx}`,
    })),
  };
}
