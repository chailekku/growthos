/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './app/Livewire/**/*.php',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50:  '#eef2ff',
                    100: '#e0e7ff',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    900: '#312e81',
                },
                calm: {
                    50:  '#f0fdf4',
                    500: '#22c55e',
                    600: '#16a34a',
                },
            },
            fontFamily: {
                sans: ['Sarabun', 'ui-sans-serif', 'system-ui'],
            },
        },
    },
    plugins: [],
};
