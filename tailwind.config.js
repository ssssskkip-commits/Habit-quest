/** @type {import('tailwindcss').Config} */
export default { content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'], theme: { extend: { fontFamily: { pixel: ['Pixelify Sans','ui-monospace','monospace'] }, colors: { ink:'#080b16', panel:'#11162a', purple:'#8b5cf6', gold:'#f6c453', success:'#4ade80' }, boxShadow:{ pixel:'4px 4px 0 #03050b' } } }, plugins: [] }
