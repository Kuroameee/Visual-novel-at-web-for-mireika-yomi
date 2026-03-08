import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#04040a",
        "void-deep": "#07071a",
        teal: {
          glow: "#00e5c8",
          soft: "#0ab8a8",
          dim: "#0a6b65",
          mist: "#1a4a45",
        },
        spirit: {
          light: "#c8f0f0",
          fade: "#7ab8b8",
        },
        soul: "#1a0a2e",
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        crimson: ["Crimson Text", "serif"],
        gothic: ["IM Fell English", "serif"],
        zombie: ["BloodVictimZombie", "Cinzel", "serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "particle-rise": "particleRise 4s ease-out infinite",
        "flicker": "flicker 3s ease-in-out infinite",
        "fog-drift": "fogDrift 20s linear infinite",
        "text-shimmer": "textShimmer 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6", filter: "blur(0px)" },
          "50%": { opacity: "1", filter: "blur(1px)" },
        },
        particleRise: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "1" },
          "100%": { transform: "translateY(-120px) translateX(20px)", opacity: "0" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
          "75%": { opacity: "0.95" },
        },
        fogDrift: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        textShimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundImage: {
        "radial-void": "radial-gradient(ellipse at center, #07071a 0%, #04040a 100%)",
        "radial-teal": "radial-gradient(ellipse at center, rgba(0,229,200,0.15) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
