/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '102': '1.02',
        '98': '0.98',
        '97': '0.97',
      },
      // Custom colors preserving user theme with Apple/iOS materials
      colors: {
        cream: '#FDFBF7',
        'off-white': '#F9F8F4',
        forest: '#1A3A2E',
        'forest-light': '#2A4D3F',
        sage: '#7A9B7A',
        'sage-light': '#A8C3A3',
        'sage-soft': '#DCE8D4',
        clay: '#C4A484',
        'clay-light': '#D4B896',
        stone: '#6B7280',
        'stone-light': '#9CA3AF',
        charcoal: '#1F2937',
        'warm-gray': '#F5F2EB',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',

        // Apple / iOS System Tokens
        'ios-bg': '#F5F6F8',
        'ios-card': 'rgba(255, 255, 255, 0.82)',
        'ios-border': 'rgba(0, 0, 0, 0.06)',
        'ios-border-light': 'rgba(255, 255, 255, 0.6)',
        'ios-subtext': '#86868B',
        'ios-label': '#1D1D1F',
      },

      // Custom gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1A3A2E 0%, #2A4D3F 100%)',
        'gradient-sage': 'linear-gradient(135deg, #7A9B7A 0%, #A8C3A3 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C4A484 0%, #D4B896 100%)',
        'gradient-hero': 'linear-gradient(135deg, #DCE8D4 0%, #FDFBF7 100%)',
        'gradient-ios-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.72) 100%)',
        'gradient-ios-card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.86) 100%)',
        'gradient-ios-dark': 'linear-gradient(135deg, #1A3A2E 0%, #224738 100%)',
        'divider-grad': 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.08), transparent)',
        'radial-gradient-custom': 'radial-gradient(circle at 30% 50%, rgba(122, 155, 122, 0.08) 0%, transparent 70%)',
        'radial-gradient-white': 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
      },

      // Custom fonts - Apple SF Pro Stack
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"SF Pro"', '"Helvetica Neue"', 'Inter', 'sans-serif'],
        'sf': ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"SF Pro"', '"Helvetica Neue"', 'sans-serif'],
        'inter': ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"SF Pro"', 'Inter', 'sans-serif'],
        'fraunces': ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro"', '"Helvetica Neue"', 'sans-serif'],
      },

      // Custom border radius - iOS Continuous Squircles
      borderRadius: {
        'xs': '6px',
        'sm': '12px',
        'md': '20px',
        'lg': '28px',
        'xl': '36px',
        '2xl': '44px',
        'ios-sm': '14px',
        'ios-md': '20px',
        'ios-lg': '26px',
        'ios-xl': '32px',
        'ios-2xl': '40px',
        'full': '9999px',
      },

      // Custom spacing
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },

      borderWidth: {
        '0.5': '0.5px',
        '1.5': '1.5px',
        '3': '3px',
      },

      // Custom shadows - Apple diffuse ambient shadows
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)',
        'lg': '0 12px 36px rgba(0, 0, 0, 0.07), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'xl': '0 24px 48px rgba(0, 0, 0, 0.10), 0 8px 24px rgba(0, 0, 0, 0.04)',
        'ios-glass': '0 8px 32px 0 rgba(26, 58, 46, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'ios-card': '0 10px 30px -4px rgba(0, 0, 0, 0.05), 0 2px 8px -2px rgba(0, 0, 0, 0.03)',
        'ios-hover': '0 20px 40px -8px rgba(26, 58, 46, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'ios-float': '0 20px 50px rgba(0, 0, 0, 0.09)',
      },

      // Custom animations
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-up-delay': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left': 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },

      // Custom transition duration
      transitionDuration: {
        'fast': '180ms',
        'base': '280ms',
        'slow': '450ms',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
