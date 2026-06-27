/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pitch: '#0a1a0f',
        turf: '#0f2318',
        grass: '#1a3a25',
        emerald: {
          accent: '#00e87a',
          glow: '#00ff88',
          dim: '#00c462',
        },
        gold: {
          DEFAULT: '#d4a843',
          light: '#f0c060',
          dim: '#a07830',
        },
        chalk: '#f0f0f0',
        fog: '#8a9a8f',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'drift': 'drift 20s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          from: { transform: 'translateX(-10px) translateY(-5px)' },
          to: { transform: 'translateX(10px) translateY(5px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
