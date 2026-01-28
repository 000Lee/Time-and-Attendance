module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(210, 12%, 85%)",
        input: "hsl(210, 14%, 85%)",
        ring: "hsl(222, 87%, 70%)",
        background: "hsl(210, 20%, 98%)",
        foreground: "hsl(210, 15%, 20%)",
        primary: {
          DEFAULT: "hsl(222, 87%, 60%)",
          foreground: "hsl(0, 0%, 100%)",
          hover: "hsl(222, 87%, 50%)",
          active: "hsl(222, 87%, 45%)",
        },
        secondary: {
          DEFAULT: "hsl(222, 87%, 95%)",
          foreground: "hsl(222, 87%, 35%)",
          hover: "hsl(222, 87%, 90%)",
          active: "hsl(222, 87%, 85%)",
        },
        tertiary: {
          DEFAULT: "hsl(0, 0%, 96%)",
          foreground: "hsl(222, 10%, 25%)",
        },
        accent: {
          DEFAULT: "hsl(50, 100%, 60%)",
          foreground: "hsl(50, 80%, 20%)",
        },
        success: {
          DEFAULT: "hsl(142, 72%, 35%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        warning: {
          DEFAULT: "hsl(38, 90%, 55%)",
          foreground: "hsl(33, 70%, 20%)",
        },
        error: {
          DEFAULT: "hsl(0, 83%, 50%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        info: {
          DEFAULT: "hsl(222, 87%, 60%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        gray: {
          50: "hsl(210, 20%, 98%)",
          100: "hsl(210, 15%, 95%)",
          200: "hsl(210, 14%, 89%)",
          300: "hsl(210, 12%, 80%)",
          400: "hsl(210, 10%, 70%)",
          500: "hsl(210, 9%, 60%)",
          600: "hsl(210, 8%, 50%)",
          700: "hsl(210, 9%, 35%)",
          800: "hsl(210, 10%, 25%)",
          900: "hsl(210, 12%, 15%)",
        },
        card: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(210, 15%, 20%)",
        },
        muted: {
          DEFAULT: "hsl(210, 20%, 96%)",
          foreground: "hsl(210, 10%, 60%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 83%, 50%)",
          foreground: "hsl(0, 0%, 100%)",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      fontSize: {
        h1: ['32px', { lineHeight: '1.2', fontWeight: '500' }],
        h2: ['24px', { lineHeight: '1.2', fontWeight: '500' }],
        h3: ['20px', { lineHeight: '1.2', fontWeight: '500' }],
        h4: ['18px', { lineHeight: '1.2', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        body: ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px hsla(0, 0%, 0%, 0.05)',
        md: '0 2px 6px hsla(0, 0%, 0%, 0.08)',
        lg: '0 4px 12px hsla(0, 0%, 0%, 0.12)',
        xl: '0 8px 24px hsla(0, 0%, 0%, 0.16)',
        'button-sm': '0 2px 6px hsla(222, 87%, 40%, 0.2)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
        slow: '400ms',
      },
      transitionTimingFunction: {
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, hsl(222, 87%, 60%) 0%, hsl(245, 80%, 60%) 100%)',
        'gradient-secondary': 'linear-gradient(135deg, hsl(222, 87%, 95%) 0%, hsl(240, 40%, 98%) 100%)',
        'gradient-accent': 'linear-gradient(135deg, hsl(50, 100%, 60%) 0%, hsl(35, 100%, 70%) 100%)',
      },
    },
  },
  plugins: [],
};
