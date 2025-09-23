import type { Config } from "tailwindcss";
import { withUIKit } from "tailwindcss-uikit-colors";
export default withUIKit({
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  important: true,
  theme: {
    screens: {
      xs: "400px",
      sm: "660px",
      md: "768px",
      ml: "896px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      padding: {
        "18": "4.5rem",
      },
      inset: {
        "1/5": "20%",
        "22": "5.5rem",
      },
      colors: {
        background: "var(--background)",
        "background-alt": "var(--background-alt)",
        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-light": "var(--primary-light)",
        secondary: "var(--secondary)",
        "secondary-hover": "var(--secondary-hover)",
        "secondary-light": "var(--secondary-light)",
        accent: "var(--accent)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        border: "var(--border)",
        "input-bg": "var(--input-bg)",
        "input-border": "var(--input-border)",
        "card-bg": "var(--card-bg)",
      },

      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      borderWidth: {
        "1": "1px",
      },
      transitionProperty: {
        "rounded-and-color": "border-radius, border-color",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        wiggle: "wiggle 0.5s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-in-out",
        "progress-stripes": "progress-stripes 1s linear infinite",
        "pulse-shadow": "pulse-shadow 2s ease-in-out infinite",
        "swipe-hint": "swipe-hint 1.5s ease-in-out 1s",
      },
      backgroundImage: {
        "striped-gradient":
          "linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)",
      },
      backgroundSize: {
        "striped-size": "40px 40px",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
        "progress-stripes": {
          "0%": { backgroundPosition: "40px 0" },
          "100%": { backgroundPosition: "0 0" },
        },
        "pulse-shadow": {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(45, 43, 46, 0.3)",
          },
          "50%": {
            transform: "scale(1.1)",
            boxShadow: "0 0 0 10px rgba(45, 43, 46, 0)",
          },
        },
        "swipe-hint": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-12px)" },
        },
      },
    },
  },

  plugins: [],
} satisfies Config);
