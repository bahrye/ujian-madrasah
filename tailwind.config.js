/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
			},
			colors: {
				primary: {
					50: '#EEF2FF',
					100: '#E0E7FF',
					200: '#C7D2FE',
					300: '#A5B4FC',
					400: '#818CF8',
					500: '#6366F1',
					600: '#4F46E5',
					700: '#4338CA',
					800: '#3730A3',
					900: '#312E81',
					950: '#1E1B4B'
				},
				accent: {
					cyan: '#06B6D4',
					sky: '#0EA5E9',
					emerald: '#10B981',
					amber: '#F59E0B',
					rose: '#F43F5E'
				}
			},
			boxShadow: {
				glow: '0 0 20px rgba(99, 102, 241, 0.3)',
				'glow-lg': '0 0 40px rgba(99, 102, 241, 0.4)'
			},
			animation: {
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'slide-in': 'slideIn 0.3s ease-out',
				'fade-in': 'fadeIn 0.3s ease-out',
				'bounce-in': 'bounceIn 0.5s ease-out'
			},
			keyframes: {
				slideIn: {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				bounceIn: {
					'0%': { transform: 'scale(0.9)', opacity: '0' },
					'50%': { transform: 'scale(1.02)' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				}
			}
		}
	},
	plugins: []
};
