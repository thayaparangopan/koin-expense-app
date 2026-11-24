export const theme = {
  colors: {
    // Backgrounds
    background: '#F8F6F2', // Warm off-white
    card: '#FFFFFF',
    cardWarm: '#F3EFEA', // Light warm gray for buttons/inputs
    cardBorder: '#EBE6DE',
    dashedBorder: '#6EE7B7', // Mint dashed border for upload card

    // Primary & Accent
    primary: '#00B074', // Emerald green
    primaryDark: '#009663',
    primaryLight: '#E6F8F0', // Soft mint tint for pills & icons
    primaryBorder: '#A7F3D0',

    // Text & Typography
    textPrimary: '#0B132B', // Deep navy
    textSecondary: '#64748B', // Muted slate gray
    textPlaceholder: '#94A3B8',
    textWhite: '#FFFFFF',

    // Status & Feedback
    error: '#EF4444',
    errorLight: '#FEE2E2',
    success: '#00B074',
    warning: '#F59E0B',

    // Category / Activity Colors
    categories: {
      food: {
        bg: '#E6F8F3',
        text: '#00B074',
        icon: 'cafe-outline',
      },
      groceries: {
        bg: '#F3E8FF',
        text: '#8B5CF6',
        icon: 'basket-outline',
      },
      transport: {
        bg: '#E0F2FE',
        text: '#0284C7',
        icon: 'car-outline',
      },
      shopping: {
        bg: '#FEF3C7',
        text: '#D97706',
        icon: 'bag-handle-outline',
      },
      entertainment: {
        bg: '#FCE7F3',
        text: '#DB2777',
        icon: 'film-outline',
      },
    },
  },

  typography: {
    fontFamily: undefined, // Default system font
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      heavy: '800' as const,
    },
  },

  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    pill: 999,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  shadows: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    subtle: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 1,
    },
  },
};
