const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono],
      },
      colors: {
        'theme-primary': {
          DEFAULT: '#007BFF', // Albastru principal vibrant
          light: '#E6F2FF',   // O nuanță foarte deschisă pentru fundaluri
          dark: '#0056b3',    // O nuanță mai închisă pentru hover/active
        },
        'theme-accent': {
          DEFAULT: '#FFC107', // Un galben/portocaliu pentru accente
          dark: '#d39e00',
        },
        'theme-success': '#28a745', // Verde pentru succes
        'theme-danger': '#dc3545',  // Roșu pentru erori/ștergere
        'theme-warning': '#ffc107', // Galben pentru avertismente
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
};