import type { Config } from 'tailwindcss';

export default {
    darkMode: ['class'],
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    safelist: [
        'bg-green-500',
        'bg-green-400',
        'bg-red-500',
        'bg-red-400',
        'bg-green-500/50',
        'bg-green-400/50',
        'bg-red-500/50',
        'bg-red-400/50',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                lolblue1: '#CDFAFA',
                lolblue2: '#0AC8B9',
                lolblue3: '#0397AB',
                lolblue4: '#005A82',
                lolblue5: '#0A323C',
                lolblue6: '#091428',
                lolblue7: '#0A1428',
                lolgold1: '#F0E6D2',
                lolgold2: '#C8AA6E',
                lolgold3: '#C8AA6E',
                lolgold4: '#C89B3C',
                lolgold5: '#785A28',
                lolgold6: '#463714',
                lolgold7: '#32281E',
                lolgray1: '#A09B8C',
                lolgray2: '#5B5A56',
                lolgray3: '#3C3C41',
                lolgray4: '#1E2328',
                lolgraycold: '#1E282D',
                lolblackhextech: '#010A13',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
        },
        screens: {
            xl: { max: '1279px' },
            // => @media (max-width: 1279px) { ... }

            lg: { max: '1023px' },
            // => @media (max-width: 1023px) { ... }

            md: { max: '767px' },
            // => @media (max-width: 767px) { ... }

            sm: { max: '639px' },
            // => @media (max-width: 639px) { ... }
        },
    },
    plugins: [require('tailwindcss-animate')],
} satisfies Config;
