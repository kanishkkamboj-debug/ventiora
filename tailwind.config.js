/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        'on-background': 'var(--foreground)',
        
        surface: 'var(--card)',
        'on-surface': 'var(--card-foreground)',
        
        'surface-container-lowest': 'var(--card)',
        'surface-container-low': 'var(--muted)',
        'surface-container': 'var(--muted)',
        'surface-container-high': 'var(--muted)',
        'surface-container-highest': 'var(--muted)',
        
        'on-surface-variant': 'var(--muted-foreground)',
        'inverse-surface': 'var(--foreground)',
        'inverse-on-surface': 'var(--background)',
        
        primary: 'var(--primary)',
        'on-primary': 'var(--primary-foreground)',
        
        'primary-container': 'var(--accent)',
        'on-primary-container': 'var(--accent-foreground)',
        
        secondary: 'var(--secondary)',
        'on-secondary': 'var(--secondary-foreground)',
        'secondary-container': 'var(--secondary)',
        'on-secondary-container': 'var(--secondary-foreground)',
        
        error: 'var(--destructive)',
        'on-error': 'var(--destructive-foreground)',
        
        'muted-text': 'var(--muted-foreground)',
        border: 'var(--border)',
        outline: 'var(--border)',
        'outline-variant': 'var(--border)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
        'headline-md': ['var(--font-sans)'],
        'headline-xl': ['var(--font-sans)'],
        'headline-xl-mobile': ['var(--font-sans)'],
        'body-md': ['var(--font-serif)'],
        'body-lg': ['var(--font-serif)'],
        'label-sm': ['var(--font-sans)'],
        'label-md': ['var(--font-sans)'],
        'headline-lg': ['var(--font-sans)'],
      },
      fontSize: {
        "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
        "headline-xl": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "headline-xl-mobile": ["32px", {"lineHeight": "38px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
        "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
        "label-md": ["14px", {"lineHeight": "20px", "fontWeight": "500"}],
        "headline-lg": ["24px", {"lineHeight": "32px", "fontWeight": "600"}]
      },
      spacing: {
        "stack-sm": "8px",
        "stack-lg": "32px",
        "gutter": "24px",
        "container-max": "1120px",
        "stack-md": "16px",
        "margin-mobile": "16px"
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      maxWidth: {
        container: '1120px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        fadeIn: 'fadeIn 0.15s ease-out',
      },
    },
  },
  plugins: [],
}
