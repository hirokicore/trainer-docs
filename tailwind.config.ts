import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef3fa',
          100: '#d6e5f5',
          200: '#aecae8',
          300: '#7faedb',
          400: '#5691ca',
          500: '#4278b8',
          600: '#3566a3',
          700: '#29538c',
          800: '#1f4275',
          900: '#16305e',
        },
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
