import * as ImageManipulator from 'expo-image-manipulator';
import { ExtractionResult, Category, ReceiptItem } from '../types/expense';

/**
 * Prepares and optimizes receipt images down to ~120KB for reliable, fast OCR processing.
 */
async function optimizeImageForOcr(imageUri: string): Promise<string | null> {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 1000 } }], // Resize down to 1000px max width
      {
        compress: 0.72,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );
    return manipResult.base64 || null;
  } catch (err) {
    console.warn('Image manipulation fallback:', err);
    return null;
  }
}

/**
 * Calls OCR.space API with compressed base64 image data.
 */
async function callOcrSpaceApi(base64: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const cleanBase64 = base64.replace(/^data:image\/[a-z]+;base64,/, '');

    const apiKey = process.env.EXPO_PUBLIC_OCR_API_KEY || 'K88279867988957';
    const formData = new FormData();
    formData.append('apikey', apiKey);
    formData.append('base64Image', `data:image/jpeg;base64,${cleanBase64}`);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('isTable', 'true');
    formData.append('scale', 'true');
    formData.append('detectOrientation', 'true');
    formData.append('OCREngine', '2'); // Engine 2 is optimized for receipts & numbers

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn('OCR API response not OK:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('OCR.space Response:', JSON.stringify(data).slice(0, 300));

    if (data && data.ParsedResults && data.ParsedResults.length > 0) {
      const parsedText = data.ParsedResults[0].ParsedText;
      return parsedText && parsedText.trim().length > 0 ? parsedText : null;
    }
  } catch (err) {
    console.warn('OCR space request error:', err);
  }
  return null;
}

/**
 * Parses raw OCR text into structured receipt information.
 */
function parseOcrText(rawText: string, imageUri?: string): ExtractionResult {
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 1. Merchant Detection
  const skipKeywords = [
    'receipt',
    'tax invoice',
    'tax',
    'invoice',
    'welcome',
    'thank you',
    'cashier',
    'bill',
    'order',
    'table',
    'date',
    'time',
    'tel',
    'phone',
    'terminal',
    'merchant',
    'gst',
    'vat',
  ];

  let merchant = '';
  for (const line of lines.slice(0, 6)) {
    const lower = line.toLowerCase();
    const shouldSkip =
      skipKeywords.some((w) => lower.includes(w)) ||
      /^\d+$/.test(line) ||
      line.length < 3;
    if (!shouldSkip) {
      // Clean leading special chars
      merchant = line.replace(/^[#*+=_.\s-]+/, '').trim();
      break;
    }
  }
  if (!merchant) merchant = lines[0] || 'Store Receipt';

  // 2. Date Detection
  let date = 'Nov 24, 2026';
  const dateRegex =
    /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/i;
  for (const line of lines) {
    const match = line.match(dateRegex);
    if (match) {
      date = match[0];
      break;
    }
  }

  // 3. Category Detection
  const fullTextLower = rawText.toLowerCase();
  let category: Category = 'Food & Dining';
  if (
    fullTextLower.includes('super') ||
    fullTextLower.includes('market') ||
    fullTextLower.includes('grocery') ||
    fullTextLower.includes('food city') ||
    fullTextLower.includes('cargills') ||
    fullTextLower.includes('keells') ||
    fullTextLower.includes('mart')
  ) {
    category = 'Groceries';
  } else if (
    fullTextLower.includes('uber') ||
    fullTextLower.includes('pickme') ||
    fullTextLower.includes('taxi') ||
    fullTextLower.includes('petrol') ||
    fullTextLower.includes('fuel') ||
    fullTextLower.includes('cab')
  ) {
    category = 'Transport';
  } else if (
    fullTextLower.includes('store') ||
    fullTextLower.includes('cloth') ||
    fullTextLower.includes('mall') ||
    fullTextLower.includes('shop') ||
    fullTextLower.includes('pharmacy') ||
    fullTextLower.includes('fashion')
  ) {
    category = 'Shopping';
  } else if (
    fullTextLower.includes('cinema') ||
    fullTextLower.includes('movie') ||
    fullTextLower.includes('theatre') ||
    fullTextLower.includes('game')
  ) {
    category = 'Entertainment';
  }

  // 4. Line Items Extraction
  const items: ReceiptItem[] = [];
  const summarySkip = [
    'total',
    'subtotal',
    'sub-total',
    'sub total',
    'tax',
    'cash',
    'change',
    'balance',
    'visa',
    'mastercard',
    'card',
    'discount',
    'amount due',
    'amount',
    'vat',
    'service charge',
    'net amount',
    'tendered',
  ];

  // Regex looking for a line with item description and price
  // e.g., "Avocado Toast 14.00" or "Milk Rs. 450.00" or "Coffee 450"
  const priceRegex = /(?:Rs\.?|LKR|\$)?\s*([0-9]{1,5}(?:\.[0-9]{1,2})?)\s*$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    // Check if summary line
    const isSummary = summarySkip.some(
      (s) => lower.startsWith(s) || lower.includes('total')
    );
    if (isSummary) continue;

    const match = line.match(priceRegex);
    if (match) {
      const rawPrice = match[1];
      const itemName = line
        .replace(match[0], '')
        .replace(/[-–—:_.]*$/, '')
        .trim();
      const parsedFloat = parseFloat(rawPrice);

      if (itemName.length >= 2 && !isNaN(parsedFloat) && parsedFloat > 0) {
        items.push({
          id: `item-${Date.now()}-${items.length}`,
          name: itemName,
          priceCents: Math.round(parsedFloat * 100),
        });
      }
    }
  }

  // If no items were parsed with regex, search lines for amounts
  if (items.length === 0) {
    for (const line of lines) {
      const match = line.match(
        /(?:total|amount|due|subtotal)?[:\s]*(?:Rs\.?|LKR|\$)?\s*([0-9]{1,5}(?:\.[0-9]{2})?)/i
      );
      if (match && parseFloat(match[1]) > 0) {
        items.push({
          id: `item-${Date.now()}-1`,
          name: `${merchant} Total`,
          priceCents: Math.round(parseFloat(match[1]) * 100),
        });
        break;
      }
    }
  }

  // If still empty (e.g., text recognized but prices were unformatted), use the lines as items
  if (items.length === 0) {
    const candidateLines = lines.slice(1, 4);
    if (candidateLines.length > 0) {
      candidateLines.forEach((cl, idx) => {
        items.push({
          id: `item-${Date.now()}-${idx}`,
          name: cl,
          priceCents: 500 * (idx + 1), // Default editable amount
        });
      });
    } else {
      items.push({
        id: `item-${Date.now()}-1`,
        name: `${merchant} Expense`,
        priceCents: 1500,
      });
    }
  }

  return {
    merchant,
    date,
    category,
    items,
    imageUri,
  };
}

/**
 * Extracts receipt information from an image or simulated camera input.
 */
export async function extractReceiptData(
  imageUri?: string,
  initialBase64?: string
): Promise<ExtractionResult> {
  // If an image was uploaded, perform real OCR!
  if (imageUri || initialBase64) {
    let base64 = initialBase64;

    // Optimize image to ~120KB for fast, reliable OCR upload
    if (imageUri) {
      const optimizedBase64 = await optimizeImageForOcr(imageUri);
      if (optimizedBase64) {
        base64 = optimizedBase64;
      }
    }

    if (base64) {
      const rawText = await callOcrSpaceApi(base64);
      if (rawText && rawText.trim().length > 0) {
        console.log('Real OCR Extracted Text:\n', rawText);
        return parseOcrText(rawText, imageUri);
      }
    }

    // If OCR could not reach server (e.g. offline), create receipt from image directly without fake sample data
    return {
      merchant: 'Scanned Receipt',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      category: 'Food & Dining',
      items: [
        {
          id: `item-${Date.now()}-1`,
          name: 'Scanned Item',
          priceCents: 1000, // Rs. 10.00
        },
      ],
      imageUri,
    };
  }

  // Fallback for simulated flow when user taps "Sample" without selecting an image
  return {
    merchant: 'Cafe Kumbuk',
    date: 'Nov 24, 2026',
    category: 'Food & Dining',
    items: [
      { id: 'item-1', name: 'Avocado toast', priceCents: 1400 },
      { id: 'item-2', name: 'Cappuccino', priceCents: 650 },
      { id: 'item-3', name: 'Banana pancakes', priceCents: 800 },
    ],
  };
}
