import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        void:    '#050507',
        deep:    '#08080d',
        surface: '#0d0d15',
        raised:  '#13131e',
        ink:     '#a0a0b8',
        dim:     '#404058',
        white:   '#f0f0f8',
        violet:  { DEFAULT: '#7c5cfc', 2: '#a98bff' },
        electric:'#00e5ff',
        neon:    '#b4ff57',
        warn:    '#ff4757',
        gold:    '#ffd166',
      },
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        mono:    ['Azeret Mono', 'monospace'],
      },
      animation: {
        'pulse-dot':  'pulse 2s infinite',
        'drift1':     'drift1 12s ease-in-out infinite',
        'drift2':     'drift2 16s ease-in-out infinite',
        'drift3':     'drift3 20s ease-in-out infinite',
        'scan':       'scan 3s linear infinite',
        'marquee':    'marquee 30s linear infinite',
        'rise':       'riseIn .8s forwards',
      },
      keyframes: {
        drift1:  { '0%,100%': { transform: 'translate(0,0)' }, '50%': { transform: 'translate(-40px,60px)' } },
        drift2:  { '0%,100%': { transform: 'translate(0,0)' }, '50%': { transform: 'translate(60px,-40px)' } },
        drift3:  { '0%,100%': { transform: 'translate(0,0)' }, '33%': { transform: 'translate(30px,30px)' }, '66%': { transform: 'translate(-20px,-20px)' } },
        scan:    { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100vh)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        riseIn:  { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
export default config
