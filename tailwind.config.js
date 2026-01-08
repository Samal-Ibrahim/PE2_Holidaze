import lineClamp from "@tailwindcss/line-clamp"
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		fontSize: {
			// Standard sizes
			xs: "0.75rem", // 12px
			sm: "0.875rem", // 14px
			base: "1rem", // 16px
			lg: "1.125rem", // 18px
			xl: "1.25rem", // 20px
		},
		screens: {
			"2xs": "320px",
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		extend: {
			fontSize: {
				// Custom sizes
				tiny: "0.625rem", // 10px
				huge: "3.5rem", // 56px
				massive: "5rem", // 80px
			},
			fontFamily: {
				hero: ["JuliusSansOne", "sans-serif"],
				logo: ["Alike", "sans-serif"],
				heading: ["Alike", "serif"],
				body: ["Lora", "serif"],
				p: ["Lora", "serif"],
				// Fallback sans-serif stack
				sans: [
					"ui-sans-serif",
					"system-ui",
					"-apple-system",
					"BlinkMacSystemFont",
					"Segoe UI",
					"Roboto",
					"Helvetica Neue",
					"Arial",
					"sans-serif",
				],
				// Fallback serif stack
				serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
			},
			colors: {
				brand: {
					bg: "rgba(var(--color-bg))",
					txt: "rgba(var(--color-text))",
					contentBg: "rgba(var(--color-content-bg))",
					heading: "rgba(var(--color-heading))",
				},
				accent: {
					light: "#FCD34D",
					DEFAULT: "#FBBF24",
					dark: "#B45309",
				},
			},
		},
	},
	plugins: [lineClamp],
}
