/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  
  theme: {
    extend: {
      // === Color System ===
      colors: {
        'primary': {
          50: '#FAFBFF',   // Very light tint
          100: '#EFF1FE',  // Light tint
          200: '#DADEFD',  // Lighter
          300: '#B4C0FB',  // Light
          400: '#8B9CF9',  // Medium light
          500: '#4F60F4',  // Default - main brand color
          600: '#3730A3',  // Medium dark
          700: '#312E81',  // Dark
          800: '#1E1B4B',  // Darker
          900: '#0F0D2A',  // Very dark
          DEFAULT: '#4F60F4',
        },
        
        'secondary': {
          50: '#FFFBEB',   // Very light yellow
          100: '#FEF3C7',  // Light yellow
          200: '#FDE68A',  // Lighter
          300: '#FCD34D',  // Light
          400: '#FBBF24',  // Medium light
          500: '#FACC15',  // Default - warm yellow
          600: '#E3B30B',  // Medium dark
          700: '#D97706',  // Dark
          800: '#B45309',  // Darker
          900: '#92400E',  // Very dark
          DEFAULT: '#FACC15',
        },
        
        'gradient': {
          'blue-purple': 'linear-gradient(135deg, #4F60F4 0%, #7037E2 100%)',
          'yellow-orange': 'linear-gradient(135deg, #FACC15 0%, #F59E0B 100%)',
          'green-teal': 'linear-gradient(135deg, #10B981 0%, #0D9488 100%)',
          'pink-purple': 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
          'blue-cyan': 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
          'orange-red': 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
        },
        
        'accent': {
          50: '#ECFDF5',   // Very light green
          100: '#D1FAE5',  // Light green
          200: '#A7F3D0',  // Lighter
          300: '#6EE7B7',  // Light
          400: '#34D399',  // Medium light
          500: '#10B981',  // Default - success green
          600: '#059669',  // Medium dark
          700: '#047857',  // Dark
          800: '#065F46',  // Darker
          900: '#064E3B',  // Very dark
          DEFAULT: '#10B981',
        },
        
        'danger': {
          50: '#FEF2F2',   // Very light red
          100: '#FEE2E2',  // Light red
          200: '#FECACA',  // Lighter
          300: '#FCA5A5',  // Light
          400: '#F87171',  // Medium light
          500: '#EF4444',  // Default - error red
          600: '#DC2626',  // Medium dark
          700: '#B91C1C',  // Dark
          800: '#991B1B',  // Darker
          900: '#7F1D1D',  // Very dark
          DEFAULT: '#EF4444',
        },
        
        'warning': {
          50: '#FFFBEB',   // Very light orange
          100: '#FEF3C7',  // Light orange
          200: '#FDE68A',  // Lighter
          300: '#FCD34D',  // Light
          400: '#FBBF24',  // Medium light
          500: '#F59E0B',  // Default - warning orange
          600: '#D97706',  // Medium dark
          700: '#B45309',  // Dark
          800: '#92400E',  // Darker
          900: '#78350F',  // Very dark
          DEFAULT: '#F59E0B',
        },
        
        'info': {
          50: '#EFF6FF',   // Very light blue
          100: '#DBEAFE',  // Light blue
          200: '#BFDBFE',  // Lighter
          300: '#93C5FD',  // Light
          400: '#60A5FA',  // Medium light
          500: '#3B82F6',  // Default - info blue
          600: '#2563EB',  // Medium dark
          700: '#1D4ED8',  // Dark
          800: '#1E40AF',  // Darker
          900: '#1E3A8A',  // Very dark
          DEFAULT: '#3B82F6',
        },
        
        'neutral': {
          50: '#F9FAFB',   // Very light gray
          100: '#F3F4F6',  // Light background
          200: '#E5E7EB',  // Borders, dividers
          300: '#D1D5DB',  // Disabled elements
          400: '#9CA3AF',  // Placeholder text
          500: '#6B7280',  // Secondary text
          600: '#4B5563',  // Primary text light
          700: '#374151',  // Primary text
          800: '#1F2937',  // Headings, important text
          900: '#111827',  // Very dark text
        },
        
        // Semantic color aliases
        'surface': {
          DEFAULT: '#FFFFFF',
          muted: '#F9FAFB',
          subtle: '#F3F4F6',
          disabled: '#E5E7EB',
        },
        
        'text': {
          primary: '#1F2937',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
          disabled: '#D1D5DB',
          inverse: '#FFFFFF',
        },
        
        'border': {
          DEFAULT: '#E5E7EB',
          muted: '#F3F4F6',
          strong: '#D1D5DB',
        },
      },
      
      // === Typography ===
      fontFamily: {
        sans: [
          '"Inter"',
          '"Inter var"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
        '5xl': ['3rem', { lineHeight: '1' }],           // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px
        '7xl': ['4.5rem', { lineHeight: '1' }],         // 72px
        '8xl': ['6rem', { lineHeight: '1' }],           // 96px
        '9xl': ['8rem', { lineHeight: '1' }],           // 128px
      },
      
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      
      // === Spacing & Layout ===
      spacing: {
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '128': '32rem',   // 512px
        '144': '36rem',   // 576px
      },
      
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',    // 16px
          sm: '1.5rem',       // 24px
          md: '2rem',         // 32px
          lg: '2.5rem',       // 40px
          xl: '3rem',         // 48px
          '2xl': '4rem',      // 64px
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
      
      // === Visual Effects ===
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 12px 0 rgba(0, 0, 0, 0.07)',
        'card-hover': '0 6px 20px 0 rgba(0, 0, 0, 0.12)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'drawer': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'button': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'button-hover': '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        'focus': '0 0 0 3px rgba(79, 96, 244, 0.1)',
        'focus-error': '0 0 0 3px rgba(239, 68, 68, 0.1)',
        'focus-success': '0 0 0 3px rgba(16, 185, 129, 0.1)',
        'focus-warning': '0 0 0 3px rgba(245, 158, 11, 0.1)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(79, 96, 244, 0.3)',
      },
      
      borderRadius: {
        'xs': '0.125rem',  // 2px
        'sm': '0.25rem',   // 4px
        DEFAULT: '0.375rem', // 6px
        'md': '0.5rem',    // 8px
        'lg': '0.75rem',   // 12px
        'xl': '1rem',      // 16px
        '2xl': '1.25rem',  // 20px
        '3xl': '1.5rem',   // 24px
      },
      
      // === Animations & Transitions ===
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-in-back': 'cubic-bezier(0.36, 0, 0.66, -0.56)',
        'ease-out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-in-out-back': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },
      
      transitionDuration: {
        '50': '50ms',
        '150': '150ms',
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
        '450': '450ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },
      
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        fadeInSlow: 'fadeIn 1s ease-in-out',
        fadeInSlower: 'fadeIn 2s ease-in-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
        spin: 'spin 1s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 10s ease-in-out infinite',
        wave: 'wave 2.5s ease-in-out infinite',
        bounce3d: 'bounce3d 3s ease-in-out infinite',
        gradientMove: 'gradientMove 6s ease infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(5px) rotate(-1deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        wave: {
          '0%': { transform: 'rotate(0.0deg)' },
          '10%': { transform: 'rotate(14.0deg)' },
          '20%': { transform: 'rotate(-8.0deg)' },
          '30%': { transform: 'rotate(14.0deg)' },
          '40%': { transform: 'rotate(-4.0deg)' },
          '50%': { transform: 'rotate(10.0deg)' },
          '60%': { transform: 'rotate(0.0deg)' },
          '100%': { transform: 'rotate(0.0deg)' },
        },
        bounce3d: {
          '0%, 100%': { 
            transform: 'translateY(0) scale(1)',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
          },
          '50%': { 
            transform: 'translateY(-20px) scale(1.05)',
            boxShadow: '0 20px 30px rgba(0, 0, 0, 0.15)'
          },
        },
        gradientMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      
      // === Grid & Flexbox ===
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(0, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(0, 1fr))',
        'auto-fit-xs': 'repeat(auto-fit, minmax(16rem, 1fr))',
        'auto-fit-sm': 'repeat(auto-fit, minmax(20rem, 1fr))',
        'auto-fit-md': 'repeat(auto-fit, minmax(24rem, 1fr))',
        'auto-fit-lg': 'repeat(auto-fit, minmax(28rem, 1fr))',
      },
      
      // === Utilities ===
      backdropBlur: {
        xs: '2px',
      },
      
      backdropBrightness: {
        25: '.25',
        175: '1.75',
      },
      
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      // === Responsive Design ===
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  
  plugins: [
    // Essential plugins for better styling
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-md': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
        },
        '.text-shadow-lg': {
          textShadow: '0 15px 30px rgba(0, 0, 0, 0.11), 0 5px 15px rgba(0, 0, 0, 0.08)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
        '.bg-gradient-primary': {
          background: 'linear-gradient(135deg, #4F60F4 0%, #7037E2 100%)',
        },
        '.bg-gradient-secondary': {
          background: 'linear-gradient(135deg, #FACC15 0%, #F59E0B 100%)',
        },
        '.bg-gradient-success': {
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        },
        '.bg-gradient-danger': {
          background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
        },
        '.bg-gradient-warning': {
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        },
        '.bg-gradient-info': {
          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        },
        '.bg-glass': {
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
        '.bg-glass-dark': {
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
  
  corePlugins: {
    preflight: true,
  },
  
  // Safelist important classes that might be used dynamically
  safelist: [
    // Animation classes
    'animate-fade-in',
    'animate-fade-out',
    'animate-slide-up',
    'animate-slide-down',
    'animate-scale-in',
    'animate-scale-out',
    
    // Dynamic color classes
    {
      pattern: /(bg|text|border)-(primary|secondary|accent|danger|warning|info)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    
    // Shadow classes
    'shadow-focus',
    'shadow-focus-error',
    'shadow-focus-success',
    'shadow-focus-warning',
    'shadow-glow',
  ],
}