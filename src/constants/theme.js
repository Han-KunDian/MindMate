// MindMate Design System - Theme Colors
export const Colors = {
  // Primary palette - Warm purple
  primary: '#9C7CF4',
  primaryLight: '#E8DEF8',
  primaryDark: '#7C4DFF',
  
  // Secondary - Warm orange
  secondary: '#FFB74D',
  secondaryLight: '#FFE0B2',
  
  // Background colors
  background: '#FAFBFF',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text colors
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
  
  // Emotion colors
  emotions: {
    happy: '#4CAF50',
    sad: '#5C6BC0',
    anxious: '#FF9800',
    angry: '#EF5350',
    neutral: '#90A4AE',
    excited: '#FFEB3B',
  },
  
  // Semantic colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#EF5350',
  info: '#2196F3',
  
  // UI colors
  border: '#E5E7EB',
  divider: '#F3F4F6',
  disabled: '#D1D5DB',
  placeholder: '#9CA3AF',
  
  // Gradient colors
  gradientStart: '#E8DEF8',
  gradientEnd: '#FFE0B2',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export default {
  Colors,
  Spacing,
  BorderRadius,
  FontSizes,
  Shadows,
};
