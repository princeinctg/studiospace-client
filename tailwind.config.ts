import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#171717",
          50: "#2a2a2a",
          100: "#222222",
          200: "#1a1a1a",
          900: "#121212",
        },
        ivory: {
          DEFAULT: "#F5F2EB",
          50: "#FAF9F5",
          100: "#F5F2EB",
          200: "#EBE5D8",
        },
        cream: {
          DEFAULT: "#EDE3D2",
          50: "#F4EDE1",
          100: "#EDE3D2",
          200: "#E0D2BC",
        },
        orange: {
          brand: "#FF6B35",
          hover: "#E85924",
          light: "rgba(255, 107, 53, 0.12)",
        },
        forest: {
          DEFAULT: "#173D32",
          dark: "#0F2A22",
          light: "rgba(23, 61, 50, 0.15)",
        },
        gold: {
          DEFAULT: "#C6A15B",
          dark: "#A8833E",
          light: "rgba(198, 161, 91, 0.15)",
        },
        // Semantic design system mapped to CSS variables
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        cinematic: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
        glow: "0 0 25px -5px rgba(255, 107, 53, 0.4)",
        goldGlow: "0 0 20px -5px rgba(198, 161, 91, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
