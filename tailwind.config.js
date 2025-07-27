/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './posts/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Geist Mono"', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),   
  ],
};
