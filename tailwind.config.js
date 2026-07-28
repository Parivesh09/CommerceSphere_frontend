
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {

    screens: {
      'xs': '475px',
      'sm': '640px',   // Mobile
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Wide
      '2xl': '1536px', // Extra wide
    },
    extend: {
      colors: {
        primary: '#3525cd',
        'on-primary': '#ffffff',
        'primary-container': '#4f46e5',
        'primary-fixed': '#e2dfff',
        'primary-fixed-dim': '#c3c0ff',
        'on-primary-fixed': '#0f0069',
        'on-primary-fixed-variant': '#3323cc',
        'on-primary-container': '#dad7ff',
        secondary: '#831ada',
        'on-secondary': '#ffffff',
        'secondary-container': '#9e41f5',
        'secondary-fixed': '#f0dbff',
        'secondary-fixed-dim': '#ddb8ff',
        'on-secondary-fixed': '#2c0051',
        'on-secondary-fixed-variant': '#6800b4',
        'on-secondary-container': '#fffbff',
        tertiary: '#005338',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#006e4b',
        'tertiary-fixed': '#6ffbbe',
        'tertiary-fixed-dim': '#4edea3',
        'on-tertiary-fixed': '#002113',
        'on-tertiary-fixed-variant': '#005236',
        'on-tertiary-container': '#67f4b7',
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        background: '#f8f9ff',
        'on-background': '#0b1c30',
        surface: '#f8f9ff',
        'on-surface': '#0b1c30',
        'surface-dim': '#cbdbf5',
        'surface-bright': '#f8f9ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eff4ff',
        'surface-container': '#e5eeff',
        'surface-container-high': '#dce9ff',
        'surface-container-highest': '#d3e4fe',
        'surface-variant': '#d3e4fe',
        'on-surface-variant': '#464555',
        'inverse-surface': '#213145',
        'inverse-on-surface': '#eaf1ff',
        'inverse-primary': '#c3c0ff',
        outline: '#777587',
        'outline-variant': '#c7c4d8',
        'surface-tint': '#4d44e3',
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],

        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.5rem)',
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.875rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 2.25rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.5rem + 1.875vw, 3rem)',
        'fluid-4xl': 'clamp(2.25rem, 1.75rem + 2.5vw, 3.75rem)',
      },

      spacing: {
        'fluid-xs': 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)',
        'fluid-sm': 'clamp(0.75rem, 0.6rem + 0.75vw, 1rem)',
        'fluid-md': 'clamp(1rem, 0.8rem + 1vw, 1.5rem)',
        'fluid-lg': 'clamp(1.5rem, 1.2rem + 1.5vw, 2rem)',
        'fluid-xl': 'clamp(2rem, 1.5rem + 2.5vw, 3rem)',
        'fluid-2xl': 'clamp(3rem, 2rem + 5vw, 4rem)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },

      minWidth: {
        'touch': '44px',
      },
      minHeight: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
}
