import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        surface: '#15151C',
        elevated: '#1E1E28',
        primaryText: '#F5F5F7',
        secondaryText: '#9A9AA6',
        mutedText: '#9a9a9a',
        accent: '#5B5BFF',
        accentPressed: '#4747D1',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
        border: '#2A2A35'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-instrument-serif)', 'serif']
      },
      borderRadius: {
        card: '20px',
        btn: '14px',
        chip: '100px'
      },
      spacing: {
        18: '4.5rem'
      }
    }
  },
  plugins: []
};

export default config;
