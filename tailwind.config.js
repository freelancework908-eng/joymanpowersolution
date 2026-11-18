/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Deep Teal (#087F8C)
        primary: {
          DEFAULT: '#087F8C',
          50: '#F0F9FA',
          100: '#D8F1F3',
          200: '#B2E3E8',
          300: '#7BCFDA',
          400: '#3FB5C5',
          500: '#087F8C',
          600: '#076F7B',
          700: '#065A64',
          800: '#054850',
          900: '#04363C',
          950: '#021F23',
        },
        // Secondary: Fresh Green (#20A66A)
        secondary: {
          DEFAULT: '#20A66A',
          50: '#EDF9F3',
          100: '#D6F2E3',
          200: '#AEE6C8',
          300: '#7FD7AA',
          400: '#4DC68B',
          500: '#20A66A',
          600: '#188E59',
          700: '#147248',
          800: '#115B3A',
          900: '#0E4A30',
          950: '#072B1B',
        },
        // Heading: Dark Charcoal (#202B33)
        charcoal: {
          DEFAULT: '#202B33',
          50: '#F6F8F9',
          100: '#EDF1F3',
          200: '#DBE2E6',
          300: '#C1CCD3',
          400: '#8B9DAA',
          500: '#5C7080',
          600: '#394B59',
          700: '#2B3842',
          800: '#202B33',
          900: '#182026',
          950: '#0F1418',
        },
        heading: '#202B33',
        bodytext: '#64748B',
        sectionbg: '#F5F8F9',
        borderlight: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
