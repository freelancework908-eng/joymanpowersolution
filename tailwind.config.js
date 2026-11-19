/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Purple (#321078)
        primary: {
          DEFAULT: '#321078',
          50: '#F7F4FC',
          100: '#EFE9F9',
          200: '#DDD0F3',
          300: '#C4ADEA',
          400: '#9B74DB',
          500: '#753DC9',
          600: '#5015A8', // Secondary Purple
          700: '#3E0F87',
          800: '#321078', // Primary Purple
          900: '#26075D', // Dark Purple
          950: '#18043D',
        },
        // Secondary Purple (#5015A8)
        purpleSecondary: '#5015A8',
        darkPurple: '#26075D',
        lightLavender: '#F7F4FC',
        lightGrey: '#F4F5F8',
        darkText: '#252039',
        
        // Highlight Yellow (#FFC900) & Secondary Yellow (#F5B900)
        yellowHighlight: {
          DEFAULT: '#FFC900',
          hover: '#F5B900',
          dark: '#E0A800',
          light: '#FFF5CC',
        },
        // Direct yellow palette aliases for ease of use
        accentYellow: '#FFC900',
        accentYellowHover: '#F5B900',
        
        // WhatsApp Green (#16B83D)
        whatsappGreen: {
          DEFAULT: '#16B83D',
          hover: '#139C34',
          dark: '#0F7C2A',
          light: '#E7F8EC',
        },
        
        // Charcoal / Dark text
        charcoal: {
          DEFAULT: '#252039',
          50: '#F4F5F8',
          100: '#E9EBF0',
          200: '#D3D6DF',
          300: '#A9AFC2',
          400: '#7C84A0',
          500: '#58617F',
          600: '#414963',
          700: '#31374E',
          800: '#252039',
          900: '#191527',
          950: '#0F0D18',
        },
        
        heading: '#252039',
        bodytext: '#58617F',
        sectionbg: '#F7F4FC',
        borderlight: '#E9EBF0',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
