# Koin Expense App – Receipt Scan & Expense Review

A React Native mobile application developed as part of the **Software Engineering Intern (React Native) Engineering Challenge at Koin**.

The application allows users to upload or capture receipts, extract expense information, review and edit individual items, calculate totals dynamically, and save expenses to their recent activity.

## Project Overview

The Koin Expense App simplifies expense tracking by transforming receipt information into structured expense records.

The application implements a two-screen workflow:

1. **Expenses Screen:** Allows users to upload or capture receipts and view recent expenses.
2. **Review Receipt Screen:** Displays extracted receipt information and allows users to edit merchant details, categories, dates, and individual expense items before saving.

### Design Reference

The application follows the UI specifications and visual references provided in the Koin Engineering Challenge.

**Design Theme:**
- Warm off-white background
- Clean white cards
- Deep navy typography
- Emerald green primary actions
- Minimal and user-friendly mobile interface

## Technology Stack

| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile development |
| Expo | Development and testing environment |
| TypeScript | Type safety and maintainable code |
| Expo Image Picker | Camera and gallery receipt selection |
| React Hooks | Component state and interactive functionality |
| React Native Safe Area Context | Safe-area handling |
| Expo Vector Icons | Interface icons |

## Features

### 1. Expenses Screen

- Clean and responsive expenses dashboard.
- Upload or capture receipt functionality.
- Camera and gallery selection.
- Recent expense activity list.
- Transaction details including merchant, date, category, and amount.
- Bottom navigation interface.

### 2. Receipt Upload and Extraction

- Select receipt images from the device gallery.
- Capture receipts using the device camera.
- Display the selected receipt image.
- Show a scanning/loading state.
- Extract receipt information using a simulated extraction service with sample receipt data.

### 3. Review Receipt Screen

- Display extracted merchant information.
- Edit merchant name.
- Update receipt date.
- Select expense categories.
- Display extracted line items.
- Edit individual item names and prices.
- Add new expense items.
- Delete existing expense items.

### 4. Dynamic Expense Calculation

- Automatically calculate the total amount.
- Update the total when an item price changes.
- Recalculate when items are added or deleted.
- Use integer-based currency calculations to avoid floating-point precision issues.

### 5. Expense Submission

- Validate merchant information.
- Prevent invalid or negative item prices.
- Validate expense totals.
- Save confirmed expenses.
- Update the Recent Activity list immediately after successful submission.

## Application Architecture

The project follows a modular component-based structure to ensure high maintainability, strict separation of concerns, and code reusability.

```text
koin-expense-app/
│
├── assets/
│
├── src/
│   ├── components/
│   │   ├── BottomNavigation.tsx        # Bottom tab bar with active indicator
│   │   ├── CameraCaptureModal.tsx      # Web live webcam viewfinder & snapshot
│   │   ├── CategoryPickerModal.tsx     # Category selection bottom sheet modal
│   │   ├── ExpenseItem.tsx             # Recent activity transaction row
│   │   ├── ReceiptItem.tsx             # Editable line item with price input & delete
│   │   └── UploadCard.tsx              # Dashed receipt upload/camera launch card
│   │
│   ├── constants/
│   │   └── theme.ts                    # Colors, typography, spacing, and shadows
│   │
│   ├── screens/
│   │   ├── ExpensesScreen.tsx          # Main dashboard & receipt scanner trigger
│   │   └── ReviewReceiptScreen.tsx     # Editable receipt review, items & dynamic total
│   │
│   ├── services/
│   │   └── receiptExtraction.ts        # OCR parsing, image optimization & fallback
│   │
│   ├── types/
│   │   └── expense.ts                  # TypeScript interfaces (Expense, ReceiptItem)
│   │
│   └── utils/
│       └── currency.ts                 # Integer-based currency formatting (Rs.)
│
├── .env.example                        # Environment variables template
├── App.tsx                             # Top-level state management & screen flow
├── app.json                            # Expo app configuration & permissions
├── package.json                        # Dependencies & scripts
├── tsconfig.json                       # TypeScript compiler configuration
└── README.md
```

## Architectural Choices & Design Notes

1. **Modular Component Architecture**:
   - Presentation components (`src/components/`) are decoupled from business logic and screen state, allowing them to be individually tested and reused.
   - Separate screens (`ExpensesScreen.tsx` and `ReviewReceiptScreen.tsx`) keep navigation flows clear and maintainable.

2. **Integer-Based Currency Calculation (`currency.ts`)**:
   - In financial applications, JavaScript's IEEE-754 floating-point arithmetic causes precision bugs (e.g. `0.1 + 0.2 === 0.30000000000000004`).
   - All amounts are stored and calculated as integers in cents (`priceCents`: `1400` = `Rs. 14.00`), guaranteeing exact totals upon every addition, edit, or deletion.

3. **Two-Tier OCR & Resilient Extraction Pipeline (`receiptExtraction.ts`)**:
   - **Client-Side Optimization**: Raw smartphone photos (3MB–8MB) are pre-compressed using `expo-image-manipulator` down to ~120 KB (1000px width), preventing network lag and payload-limit errors.
   - **Live OCR Parsing**: Optimally formatted `FormData` is processed by OCR.space (Engine 2 for receipts) to extract real store names, dates, categories, and itemized prices.
   - **Fail-Safe Mechanism**: If an image is uploaded offline or OCR fails, the pipeline generates a structured receipt from the image without breaking the UI, always displaying the user's actual photo.

4. **Cross-Platform Camera & Upload Handling**:
   - **Mobile (iOS & Android)**: Seamless native camera and photo library access configured via Expo permissions in `app.json`.
   - **Web / Desktop**: Implemented an in-app live Web Camera modal using `navigator.mediaDevices.getUserMedia` so evaluators testing in desktop browsers can snap receipt photos with a real webcam without needing a physical phone.

5. **State Management & Persistence Readiness**:
   - State is managed via React Hooks (`useState`) at the root level (`App.tsx`), ensuring immediate, reactive updates to the **Recent Activity** list.
   - The modular service layer (`src/services/`) is architected so local persistence (`AsyncStorage`) or a remote backend (Supabase / REST API) can be plugged in without refactoring UI components.

## Environment Configuration

The application works completely out-of-the-box with a default free demo key and offline simulation.

To use a custom OCR API key:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and set your key:
   ```env
   EXPO_PUBLIC_OCR_API_KEY=your_ocr_space_api_key_here
   ```

## Getting Started

### Prerequisites

Before running the application, ensure that you have installed:

- **Node.js** (v18 or newer recommended)
- **npm** or **bun**
- **Git**
- **Expo Go** app on your iOS or Android mobile device (optional, for on-device testing)

### 1. Clone the Repository

```bash
git clone https://github.com/thayaparangopan/koin-expense-app.git
cd koin-expense-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npx expo start
```

### 4. Running the Application

Once the Expo development server starts, you can test across platforms:

- **Mobile Device (Expo Go)**:
  - **iOS:** Open the default Camera app and scan the QR code displayed in the terminal.
  - **Android:** Open the **Expo Go** app and scan the QR code.
- **Web Browser (Instant Desktop Preview)**:
  - Press **`w`** in the terminal to launch the app immediately in Google Chrome or your default browser.
- **Simulators / Emulators**:
  - Press **`a`** for Android Emulator.
  - Press **`i`** for iOS Simulator.

If network connection issues occur, start Expo in tunnel mode:
```bash
npx expo start --tunnel
```

## Testing Scenarios

The application is thoroughly verified against the challenge test criteria:

| Test Scenario | Expected Result | Status |
|---|---|---|
| Upload receipt from gallery | Receipt image is selected, optimized, and displayed | Verified |
| Capture receipt using camera | Live camera opens (native on mobile, webcam on web) | Verified |
| Receipt extraction | Text, store name, date, and line items are populated from image | Verified |
| Edit merchant name | Merchant name can be edited inline with pencil icon | Verified |
| Change category | Category picker modal updates category badge & icon | Verified |
| Edit item name | Line item description updates in real time | Verified |
| Edit item price | Dynamic total amount recalculates instantly in integer cents | Verified |
| Add expense item | New line item row appears with immediate total update | Verified |
| Delete expense item | Selected item is removed and total recalculates | Verified |
| Empty merchant name | Form validation prevents save and alerts user | Verified |
| Invalid or negative price | Validation prevents submission of empty/zero price items | Verified |
| Confirm and save | Saved expense is immediately prepended to Recent Activity | Verified |

## AI-Assisted Development Workflow

AI tools were used as development assistants to accelerate implementation while maintaining code quality, architecture rigor, and deep understanding of the generated code.

Tools utilized:
- **ChatGPT / Gemini:** Implementation planning, OCR parsing design, and currency precision architecture.
- **Cursor / Copilot:** Component implementation, responsive styling, and TypeScript typing.

All implementations were verified through manual testing, cross-platform validation, and static typechecking (`npx tsc --noEmit`).

## Demo Video

A demonstration showing receipt upload/capture, OCR extraction, live price recalculation, item deletion/addition, input validation, and saving to Recent Activity:

**Demo Video:** [Watch Demo Video on Google Drive](https://drive.google.com/file/d/1vC-cdmIz2fsHmFpdTQJdpyuAj4xvJaP3/view?usp=sharing)

## Application Preview

- **Expo Preview / Project Link:** [Open in Expo Go](https://expo.dev/@thayaparangopan/koin-expense-app)
- **Local Testing:** Run `npx expo start` and scan the terminal QR code using **Expo Go** or press `w` for web preview.
- **GitHub Repository:** https://github.com/thayaparangopan/koin-expense-app

## Challenge Information

**Company:** Koin  
**Position:** Software Engineering Intern (React Native)  
**Challenge:** Receipt Scan & Expense Review Flow  
**Framework:** React Native + Expo (SDK 58) + TypeScript

---

Developed as part of the Koin Software Engineering Internship recruitment process.
