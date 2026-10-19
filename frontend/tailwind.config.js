/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          cream: "#FBF9F5",
          sand: "#F5EFE6",
          lavender: {
            DEFAULT: "#E7DEFE",
            light: "#F3EFFF",
            dark: "#7A6BAE",
            border: "#D3C4FC",
          },
          mint: {
            DEFAULT: "#D8F3DC",
            light: "#EAF8EE",
            dark: "#40916C",
            border: "#B7E4C7",
          },
          peach: {
            DEFAULT: "#FFE5D9",
            light: "#FFF1EB",
            dark: "#D06A4C",
            border: "#FED0BB",
          },
          blue: {
            DEFAULT: "#D6E5FA",
            light: "#E8F0FC",
            dark: "#4A7BB0",
            border: "#B8D4F8",
          },
          rose: {
            DEFAULT: "#FCE1E8",
            light: "#FDF0F4",
            dark: "#C25975",
            border: "#F9BED0",
          },
          lemon: {
            DEFAULT: "#FEF7CD",
            light: "#FEFCE8",
            dark: "#A18218",
            border: "#FDE68A",
          },
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '21%': { transform: 'scale(1.35)', opacity: '1' }, // 4s inhale (4/19 = 21%)
          '58%': { transform: 'scale(1.35)', opacity: '0.95' }, // 7s hold (11/19 = 58%)
          '100%': { transform: 'scale(1)', opacity: '0.85' }, // 8s exhale
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        breathe: 'breathe 19s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
      },
      boxShadow: {
        'pastel-soft': '0 10px 30px -10px rgba(147, 130, 219, 0.12), 0 4px 12px -4px rgba(0, 0, 0, 0.04)',
        'pastel-card': '0 12px 35px -8px rgba(110, 130, 180, 0.10)',
        'pastel-glow': '0 0 25px rgba(216, 204, 254, 0.6)',
      },
    },
  },
  plugins: [],
};
