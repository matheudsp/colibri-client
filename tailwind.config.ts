import type { Config } from "tailwindcss";
// import tailwindcssAnimate from "tailwindcss-animated";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "400px",
        sm: "660px",
        md: "768px",
        ml: "896px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      padding: {
        "18": "4.5rem",
      },
      inset: {
        "1/5": "20%",
        "22": "5.5rem",
      },
      colors: {
        // === Integração com as variáveis CSS ===
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",

        primary: {
          DEFAULT: "var(--primary)",
          light: "var(--primary-light)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          light: "var(--secondary-light)",
          hover: "var(--secondary-hover)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--error)",
          foreground: "var(--foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",

        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "striped-gradient":
          "linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)",
      },
      backgroundSize: {
        "striped-size": "40px 40px",
      },

      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin 3s linear infinite",
        wiggle: "wiggle 0.5s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-in-out",
        "progress-stripes": "progress-stripes 1s linear infinite",
        "pulse-shadow": "pulse-shadow 2s ease-in-out infinite",
        "swipe-hint": "swipe-hint 1.5s ease-in-out 1s",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
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
  // plugins: [tailwindcssAnimated],
};

export default config;
