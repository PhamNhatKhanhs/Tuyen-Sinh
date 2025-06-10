/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html", "./src/**/*.{js,ts,jsx,tsx}", ],
  theme: {
    extend: {
      colors: {
        'primary': { light: '#6D7BFB', DEFAULT: '#4F60F4', dark: '#3B4ACC', },
        'secondary': { light: '#FCE588', DEFAULT: '#FACC15', dark: '#E3B30B', },
        'accent': { DEFAULT: '#10B981', },
        'neutral': { 50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 300: '#D1D5DB', 400: '#9CA3AF', 500: '#6B7280', 600: '#4B5563', 700: '#374151', 800: '#1F2937', 900: '#111827', },
      },
      fontFamily: {
        // Đặt Poppins làm font sans mặc định cho Tailwind utilities
        // Open Sans sẽ được áp dụng cho body thông qua global.css
        sans: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
        body: ['Open Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      container: { 
        center: true, 
        padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem', xl: '3rem',}, 
        screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1440px', },
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 12px 0 rgba(0, 0, 0, 0.07)',
        'card-hover': '0 6px 16px 0 rgba(0, 0, 0, 0.1)',
        'modal': '0 10px 30px rgba(0, 0, 0, 0.1)',
        'hero': '0 10px 30px -10px rgba(79, 96, 244, 0.3)',
        'button-primary': '0 4px 15px -5px rgba(79, 96, 244, 0.5)',
        'button-secondary': '0 4px 15px -5px rgba(250, 204, 21, 0.5)',
      },
      borderRadius: { 'xl': '10px', '2xl': '12px', '3xl': '1.5rem' },
      backgroundImage: {
        'hero-gradient': "linear-gradient(135deg, #4F60F4 0%, #6D7BFB 60%, #A4AFFF 100%)",
      },
      animation: { // Thêm animation nếu cần
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionDelay: { // Cho các class animation-delay-xxxx
        '500': '500ms',
        '1000': '1000ms',
        '2000': '2000ms',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) { // Plugin để thêm các tiện ích animation-delay
      const newUtilities = {
        '.animation-delay-500': { 'animation-delay': '500ms', },
        '.animation-delay-1000': { 'animation-delay': '1000ms', },
        '.animation-delay-2000': { 'animation-delay': '2000ms', },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
  corePlugins: { preflight: true, }
}