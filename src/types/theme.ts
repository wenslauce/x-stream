export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export const defaultTheme: Theme = {
  primary: '#EF4444', // red-500
  secondary: '#1F2937', // gray-800
  accent: '#3B82F6', // blue-500
  background: '#000000',
  text: '#FFFFFF',
  error: '#DC2626', // red-600
  success: '#059669', // emerald-600
  warning: '#D97706', // amber-600
  info: '#2563EB', // blue-600
};

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}