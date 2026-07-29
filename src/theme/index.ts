import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

const lightPalette = {
  primary: { main: '#3525cd', light: '#4f46e5', dark: '#2a1ba8' },
  secondary: { main: '#831ada', light: '#9e41f5', dark: '#6800b4' },
  tertiary: { main: '#005338', light: '#006e4b', dark: '#003824' },
  error: { main: '#ba1a1a', light: '#ffdad6', dark: '#93000a' },
  background: { default: '#f8f9ff', paper: '#ffffff' },
  text: { primary: '#0b1c30', secondary: '#464555' },
  divider: '#c7c4d8',
};

const darkPalette = {
  primary: { main: '#c3c0ff', light: '#e2dfff', dark: '#a5a1ff' },
  secondary: { main: '#ddb8ff', light: '#f0dbff', dark: '#c495ff' },
  tertiary: { main: '#4edea3', light: '#6ffbbe', dark: '#2dc189' },
  error: { main: '#ffb4ab', light: '#ffdad6', dark: '#ff8a80' },
  background: { default: '#111318', paper: '#1d1f25' },
  text: { primary: '#e2e2e9', secondary: '#c5c6d0' },
  divider: '#45464f',
};

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light' ? lightPalette : darkPalette),
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.4 },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.5 },
    h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  spacing: 8,
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '10px 24px', fontSize: '0.9375rem', fontWeight: 500 },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: mode === 'light' ? '0 4px 12px rgba(53, 37, 205, 0.25)' : '0 4px 12px rgba(195, 192, 255, 0.15)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: mode === 'light' ? '0 1px 3px rgba(0, 0, 0, 0.05)' : '0 1px 3px rgba(0, 0, 0, 0.3)' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { '& .MuiOutlinedInput-root': { borderRadius: 8 } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => {
  return createTheme(getDesignTokens(mode));
};

export const lightTheme = createAppTheme('light');
export const darkTheme = createAppTheme('dark');
