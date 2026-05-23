import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          950: '#06101a',
          900: '#0b1d2b',
          800: '#123044',
        },
      },
      boxShadow: {
        glass: '0 24px 80px rgba(2, 8, 23, 0.38)',
        'inner-soft': 'inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -18px 34px rgba(255,255,255,0.04)',
      },
      backgroundImage: {
        'aero-soft':
          'linear-gradient(135deg, rgba(148, 221, 255, 0.18), rgba(255,255,255,0.06) 42%, rgba(125, 211, 252, 0.08))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
