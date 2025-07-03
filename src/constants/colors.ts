// Healthcare AI Video Call App - Color Constants

// Primary Brand Colors - Choose one set
export const BRAND_COLORS = {
  // Blue Theme (Professional, trustworthy)
  BLUE: {
    primary: "#2563eb", // Professional blue
    primaryLight: "#3b82f6", // Lighter blue
    primaryDark: "#1d4ed8", // Darker blue
    accent: "#60a5fa", // Light blue accent
    background: "#eff6ff", // Very light blue background
  },

  // Green Theme (Health, wellness)
  GREEN: {
    primary: "#059669", // Medical green
    primaryLight: "#10b981", // Lighter green
    primaryDark: "#047857", // Darker green
    accent: "#6ee7b7", // Light green accent
    background: "#ecfdf5", // Very light green background
  },
};

// Neutral Colors (Used across all themes)
export const NEUTRAL_COLORS = {
  white: "#ffffff",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",
  black: "#000000",
};

// Status Colors (Healthcare specific)
export const STATUS_COLORS = {
  success: "#10b981", // Health/positive
  warning: "#f59e0b", // Caution
  error: "#ef4444", // Critical/emergency
  info: "#3b82f6", // Information

  // Healthcare specific status
  healthy: "#22c55e", // Good health indicators
  attention: "#f97316", // Needs attention
  critical: "#dc2626", // Critical condition
  stable: "#06b6d4", // Stable condition
};

// Component Specific Colors
export const COMPONENT_COLORS = {
  // Video call specific
  videoCall: {
    background: "#111827", // Dark background for video
    controls: "#374151", // Control bar background
    activeControl: "#10b981", // Active control state
    mutedControl: "#ef4444", // Muted/disabled state
  },

  // Navigation
  navigation: {
    background: NEUTRAL_COLORS.white,
    border: NEUTRAL_COLORS.gray200,
    activeLink: BRAND_COLORS.BLUE.primary, // Use your chosen brand color
    hoverBackground: NEUTRAL_COLORS.gray50,
  },

  // Cards and containers
  card: {
    background: NEUTRAL_COLORS.white,
    border: NEUTRAL_COLORS.gray200,
    shadow: "rgba(0, 0, 0, 0.1)",
  },
};

// Choose your brand theme here - Change this to switch between blue and green
export const ACTIVE_BRAND = BRAND_COLORS.BLUE; // or BRAND_COLORS.GREEN

// Export commonly used color combinations
export const COLORS = {
  // Brand colors (will use the active brand)
  primary: ACTIVE_BRAND.primary,
  primaryLight: ACTIVE_BRAND.primaryLight,
  primaryDark: ACTIVE_BRAND.primaryDark,
  accent: ACTIVE_BRAND.accent,
  brandBackground: ACTIVE_BRAND.background,

  // Neutral colors
  ...NEUTRAL_COLORS,

  // Status colors
  ...STATUS_COLORS,

  // Component colors
  ...COMPONENT_COLORS,
};

export default COLORS;
