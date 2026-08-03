import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

type Mode = 'light' | 'dark';

function clampChannel(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function mixWithWhite(hex: string, amount: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const mix = (channel: number) => clampChannel(channel + (255 - channel) * amount);
  const toHex = (channel: number) => channel.toString(16).padStart(2, '0');
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

function mixWithBlack(hex: string, amount: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const mix = (channel: number) => clampChannel(channel * (1 - amount));
  const toHex = (channel: number) => channel.toString(16).padStart(2, '0');
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

/**
 * Reads a theme token from index.css for the requested mode.
 * Temporarily applies the `.dark` class so the resolved value
 * always matches the mode, then restores it. Falls back to a
 * provided default when running outside a browser.
 */
function readCssVar(name: string, mode: Mode, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  const root = document.documentElement;
  const wasDark = root.classList.contains('dark');
  if (mode === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  const value = getComputedStyle(root).getPropertyValue(name).trim();
  if (wasDark) root.classList.add('dark');
  else root.classList.remove('dark');
  return value || fallback;
}

const fallbacks: Record<Mode, Record<string, string>> = {
  light: {
    primary: '#5d4ae8',
    onPrimary: '#ffffff',
    secondary: '#a23fd6',
    onSecondary: '#ffffff',
    tertiary: '#007b6b',
    onTertiary: '#ffffff',
    error: '#ba1a1a',
    onError: '#ffffff',
    success: '#007a4d',
    warning: '#8a5200',
    info: '#2a5ac7',
    background: '#f6f6fe',
    paper: '#e7e7f6',
    text: '#1a1c2e',
    textSecondary: '#565a73',
    divider: '#c9cae0',
  },
  dark: {
    primary: '#8b7bff',
    onPrimary: '#140a52',
    secondary: '#d46cff',
    onSecondary: '#2d0049',
    tertiary: '#34e0c4',
    onTertiary: '#00382f',
    error: '#ff6b7a',
    onError: '#5c000b',
    success: '#3ddf9a',
    warning: '#ffb25e',
    info: '#6cb8ff',
    background: '#070912',
    paper: '#141a35',
    text: '#eceefc',
    textSecondary: '#a9aecd',
    divider: '#262c4d',
  },
};

const getDesignTokens = (mode: Mode): ThemeOptions => {
  const fb = fallbacks[mode];
  const token = (name: string, fallback: string) => readCssVar(name, mode, fallback);

  const primary = token('--color-primary', fb.primary);
  const secondary = token('--color-secondary', fb.secondary);
  const error = token('--color-error', fb.error);

  const glow = (amount: number) =>
    `0 8px 24px -6px color-mix(in srgb, var(--color-primary) ${amount}%, transparent)`;
  const cardGlow = (amount: number) =>
    `0 1px 3px color-mix(in srgb, var(--color-on-primary-container) ${amount}%, transparent)`;

  return {
    palette: {
      mode,
      primary: {
        main: primary,
        light: mixWithWhite(primary, 0.25),
        dark: mixWithBlack(primary, 0.25),
        contrastText: token('--color-on-primary', fb.onPrimary),
      },
      secondary: {
        main: secondary,
        light: mixWithWhite(secondary, 0.25),
        dark: mixWithBlack(secondary, 0.25),
        contrastText: token('--color-on-secondary', fb.onSecondary),
      },
      error: {
        main: error,
        light: mixWithWhite(error, 0.25),
        dark: mixWithBlack(error, 0.25),
        contrastText: token('--color-on-error', fb.onError),
      },
      success: {
        main: token('--color-success', fb.success),
        light: mixWithWhite(token('--color-success', fb.success), 0.25),
        dark: mixWithBlack(token('--color-success', fb.success), 0.25),
        contrastText: token('--color-on-success', '#ffffff'),
      },
      warning: {
        main: token('--color-warning', fb.warning),
        light: mixWithWhite(token('--color-warning', fb.warning), 0.25),
        dark: mixWithBlack(token('--color-warning', fb.warning), 0.25),
        contrastText: token('--color-on-warning', '#ffffff'),
      },
      info: {
        main: token('--color-info', fb.info),
        light: mixWithWhite(token('--color-info', fb.info), 0.25),
        dark: mixWithBlack(token('--color-info', fb.info), 0.25),
        contrastText: token('--color-on-info', '#ffffff'),
      },
      background: {
        default: token('--color-background', fb.background),
        paper: token('--color-surface-container', fb.paper),
      },
      text: {
        primary: token('--color-on-surface', fb.text),
        secondary: token('--color-on-surface-variant', fb.textSecondary),
      },
      divider: token('--color-outline-variant', fb.divider),
    },
    typography: {
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      h1: { fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' },
      h2: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.015em' },
      h3: { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.3 },
      h4: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 },
      h5: { fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.4 },
      h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    spacing: 8,
    shape: { borderRadius: 14 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 12, padding: '10px 24px', fontSize: '0.9375rem', fontWeight: 600 },
          contained: {
            boxShadow: mode === 'dark' ? glow(40) : glow(35),
            '&:hover': {
              boxShadow: mode === 'dark' ? glow(55) : glow(50),
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            backgroundImage: 'none',
            boxShadow: mode === 'dark'
              ? '0 1px 3px rgb(0 0 0 / 0.4)'
              : cardGlow(6),
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: { '& .MuiOutlinedInput-root': { borderRadius: 12 } },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { backgroundImage: 'none' },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 999 },
        },
      },
    },
  };
};

export const createAppTheme = (mode: 'light' | 'dark') => {
  return createTheme(getDesignTokens(mode));
};
