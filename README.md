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

The project follows a modular component-based structure to improve maintainability and code reusability.

```text
koin-expense-app/
│
├── assets/
│
├── src/
│   ├── components/
│   │   ├── UploadCard.tsx
│   │   ├── ExpenseItem.tsx
│   │   ├── ReceiptItem.tsx
│   │   └── BottomNavigation.tsx
│   │
│   ├── screens/
│   │   ├── ExpensesScreen.tsx
│   │   └── ReviewReceiptScreen.tsx
│   │
│   ├── services/
│   │   └── receiptExtraction.ts
│   │
│   ├── types/
│   │   └── expense.ts
│   │
│   ├── utils/
│   │   └── currency.ts
│   │
│   └── constants/
│       └── theme.ts
│
├── App.tsx
├── app.json
├── package.json
└── README.md
```

*Note: The structure represents the planned application organization. Update it to match the final implementation.*

## Getting Started

### Prerequisites

Before running the application, ensure that you have installed:

- Node.js
- npm
- Git
- Visual Studio Code (or another code editor)
- Expo Go on your mobile device

### 1. Clone the Repository

```bash
git clone https://github.com/thayaparangopan/koin-expense-app.git
```

Navigate to the project directory:

```bash
cd koin-expense-app
```

### 2. Install Dependencies

```bash
npm install
```

Install the Expo dependencies:

```bash
npx expo install expo-image-picker
npx expo install react-native-safe-area-context
npx expo install @expo/vector-icons
```

### 3. Start the Development Server

```bash
npx expo start
```

### 4. Run on a Mobile Device

1. Install Expo Go from the Apple App Store or Google Play Store.
2. Connect your mobile device and development computer to the same Wi-Fi network.
3. Start the Expo development server.
4. Scan the displayed QR code using your device.
5. Open the application in Expo Go.

If the connection fails, try:

```bash
npx expo start --tunnel
```

## Testing

The application should be tested against the following scenarios.

| Test Scenario | Expected Result |
|---|---|
| Upload receipt from gallery | Receipt image is selected and displayed |
| Capture receipt using camera | Captured image is displayed |
| Receipt extraction | Sample receipt information is populated |
| Edit merchant name | Updated merchant name is displayed |
| Change category | Selected category is reflected |
| Edit item name | Updated item name is displayed |
| Edit item price | Total recalculates automatically |
| Add expense item | New item appears and total updates |
| Delete expense item | Selected item is removed and total updates |
| Empty merchant name | Submission is prevented |
| Invalid or negative price | Validation prevents invalid submission |
| Confirm and save | Expense appears in Recent Activity |

## AI-Assisted Development Workflow

AI tools are used as development assistants to accelerate implementation while maintaining code quality and understanding of the generated code.

Tools may include:

- **ChatGPT:** Implementation planning, code generation, debugging assistance, and technical explanations.
- **Cursor / GitHub Copilot:** Development assistance, component implementation, and code suggestions.

AI-assisted development is supported by manual review, debugging, and testing.

The final implementation decisions, code verification, and testing are performed as part of the development process.

## Design and Implementation Decisions

- **Component-based architecture:** Reusable components help maintain consistency across screens.
- **TypeScript:** Provides type safety for expense records and component properties.
- **State management:** React Hooks manage receipt details, editable items, and expense records.
- **Currency precision:** Integer-based currency calculations help avoid floating-point arithmetic errors.
- **Simulated extraction:** Sample receipt data enables reviewers to test the application without requiring external API credentials.
- **Cross-platform development:** Expo supports development and testing across iOS and Android.

## Demo Video

A 45–60 second demonstration will be provided, showing:

1. Receipt upload or capture.
2. Receipt extraction and loading state.
3. Editing receipt details and line items.
4. Adding and deleting expense items.
5. Dynamic total recalculation.
6. Validation of an invalid input.
7. Saving an expense.
8. The updated Recent Activity list.

**Demo Video:** (https://drive.google.com/file/d/1vC-cdmIz2fsHmFpdTQJdpyuAj4xvJaP3/view?usp=sharing)

## Application Preview

**Expo Preview:** [Add Expo preview link or QR code]

**GitHub Repository:** https://github.com/thayaparangopan/koin-expense-app

## Challenge Information

**Company:** Koin  
**Position:** Software Engineering Intern (React Native)  
**Challenge:** Receipt Scan & Expense Review Flow  
**Framework:** React Native + Expo + TypeScript

---

Developed as part of the Koin Software Engineering Internship recruitment process.
