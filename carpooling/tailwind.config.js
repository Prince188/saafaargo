/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Your custom colors from :root
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
        pending: '#F59E0B',
        info: '#3B82F6',
        'success-bg': 'rgba(16, 185, 129, 0.1)',
        'error-bg': 'rgba(239, 68, 68, 0.1)',
        'info-bg': 'rgba(59, 130, 246, 0.1)',
        // Alternative naming
        bg: '#f8f6ef',
        fg: '#0f1d15',
        muted: '#5a6b62',
        card: '#ffffff',
        border: '#dde3df',
        primary: '#1a3d2c',
        'primary-fg': '#f8f6ef',
        accent: '#266b46',
        mint: '#c8e3cf',
        'mint-soft': '#dcefdf',
      },
      
      // Custom gradients
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #DCE8D4 0%, #FDFBF7 100%)',
        'gradient-primary': 'linear-gradient(135deg, #1A3A2E 0%, #2A4D3F 100%)',
        'gradient-sage': 'linear-gradient(135deg, #7A9B7A 0%, #A8C3A3 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C4A484 0%, #D4B896 100%)',
      },
      
      // Custom shadows
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
        'soft': '0 10px 40px -15px rgba(20, 50, 35, 0.18)',
        'sm': '0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'lg': '0 12px 32px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
        'xl': '0 24px 48px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.06)',
        '2xl': '0 32px 64px rgba(0, 0, 0, 0.14)',
      },
      
      // Custom border radius
      borderRadius: {
        'xs': '6px',
        'sm': '12px',
        'md': '20px',
        'lg': '32px',
        'xl': '48px',
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
      
      // Custom transitions
      transitionTimingFunction: {
        'base': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'fast': '200ms',
        'base': '300ms',
        'slow': '500ms',
      },
    },
  },
  plugins: [],
}