/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

      scale: {
        '102': '1.02',
      },
      // Custom colors (from your root variables)
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
      },

      // Custom gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1A3A2E 0%, #2A4D3F 100%)',
        'gradient-sage': 'linear-gradient(135deg, #7A9B7A 0%, #A8C3A3 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C4A484 0%, #D4B896 100%)',
        'gradient-hero': 'linear-gradient(135deg, #DCE8D4 0%, #FDFBF7 100%)',
        'divider-grad': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
        'radial-gradient-custom': 'radial-gradient(circle at 30% 50%, rgba(122, 155, 122, 0.08) 0%, transparent 70%)',
        'radial-gradient-white': 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
      },

      // Custom fonts
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'fraunces': ['Fraunces', 'serif'],
      },

      // Custom border radius
      borderRadius: {
        'xs': '6px',
        'sm': '12px',
        'md': '20px',
        'lg': '32px',
        'xl': '48px',
        'full': '9999px',
      },

      // Custom spacing (removes need for var(--spacing-*))
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
        '1.5': '1.5px',
        '3': '3px',
      },

      // Custom shadows
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'lg': '0 12px 32px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
        'xl': '0 24px 48px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.06)',
      },

      // Custom animations
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-up-delay': 'fadeInUp 0.6s ease-out 0.1s both',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },

      // Custom transition duration
      transitionDuration: {
        'fast': '200ms',
        'base': '300ms',
        'slow': '500ms',
      },
    },
  },
  plugins: [],
}