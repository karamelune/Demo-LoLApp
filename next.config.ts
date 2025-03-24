import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
};

module.exports = {
    images: {
        domains: ['ddragon.leagueoflegends.com'],
    },
    env: {
        RIOT_API_KEY: process.env.RIOT_API_KEY,
        DDRAGON_BASE_URL: process.env.DDRAGON_BASE_URL,
        MONGODB_URI: process.env.MONGODB_URI,
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 's-maxage=86400, stale-while-revalidate=59',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
