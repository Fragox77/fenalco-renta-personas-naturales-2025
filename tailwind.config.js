/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        fen: {
          green:   '#00CE7C',
          greenHi: '#1FE595',
          greenLo: '#00A363',
          purple:  '#280071',
          purpleHi:'#3A0B9B',
          navy:    '#0C2340',
          navyDeep:'#07172B',
          teal:    '#20D5C4',
          tealHi:  '#5EEFE0',
          gray:    '#4B4F54',
          bg0:     '#050B16',
          bg1:     '#0A1426',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      boxShadow: {
        cta:    '0 10px 30px -10px rgba(0,206,124,0.55), 0 0 0 1px rgba(0,206,124,0.25) inset',
        ctaHi:  '0 14px 36px -10px rgba(0,206,124,0.7),  0 0 0 1px rgba(0,206,124,0.35) inset',
        glassHi:'0 30px 60px -20px rgba(0,0,0,0.6)',
      },
      animation: {
        'pulse-dot': 'pulseDot 1.6s ease-in-out infinite',
      },
      keyframes: {
        pulseDot: {
          '0%,100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
