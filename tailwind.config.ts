import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#08080B',
          elev1: '#0E0E13',
          elev2: '#14141B',
        },
        fg: {
          DEFAULT: '#FAFAFA',
          muted: 'rgba(250,250,250,0.56)',
          dim: 'rgba(250,250,250,0.32)',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          hi: 'rgba(255,255,255,0.12)',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
