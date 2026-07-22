/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', 
    content: [
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
            },
            colors: {
                brand: {
                    teal: {
                        50: '#f0fdfa',
                        100: '#ccfbf1',
                        400: '#2dd4bf',
                        500: '#14b8a6',
                        600: '#0d9488',
                        700: '#0f766e',
                        900: '#134e4a',
                    },
                    amber: {
                        50: '#fffbeb',
                        400: '#fbbf24',
                        500: '#f59e0b',
                        600: '#d97706',
                        700: '#b45309',
                    },
                    navy: {
                        700: '#1f2937',
                        800: '#111827',
                        900: '#0b0f19',
                    },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};
