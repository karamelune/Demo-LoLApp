import { NextResponse, NextRequest } from 'next/server';
import { getSummonerByPUUID } from '@/services/riotApi';
import { cache } from '@/lib/cache';

type Params = {
    puuid: string;
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    try {
        const { puuid } = await params;

        if (!puuid) {
            return NextResponse.json(
                { error: 'PUUID manquant' },
                { status: 400 }
            );
        }

        const cacheKey = `summoner:${puuid}`;
        const cachedData = (await cache.get(cacheKey)) as string | null;

        if (cachedData) {
            return NextResponse.json(JSON.parse(cachedData), {
                status: 200,
                headers: {
                    'Cache-Control': 'max-age=300, s-maxage=600',
                    'X-Cache': 'HIT',
                },
            });
        }

        const encodedPUUID = encodeURIComponent(puuid);
        const response = await Promise.race([
            getSummonerByPUUID(encodedPUUID),
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), 7000)
            ),
        ]);

        await cache.set(cacheKey, JSON.stringify(response), 300);

        return NextResponse.json(response, {
            status: 200,
            headers: {
                'Cache-Control': 'max-age=300, s-maxage=600',
                'X-Cache': 'MISS',
            },
        });
    } catch (error: unknown) {
        console.error("Erreur lors de l'appel à RiotApi:", error);

        if (error instanceof Error && error.message === 'Request timeout') {
            return NextResponse.json(
                { error: 'La requête a pris trop de temps' },
                { status: 504 }
            );
        }

        const riotError = error as any;
        if (
            typeof riotError === 'object' &&
            riotError !== null &&
            'status' in riotError
        ) {
            if (riotError.status === 404) {
                return NextResponse.json(
                    { error: 'Invocateur non trouvé' },
                    { status: 404 }
                );
            }

            if (riotError.status === 429) {
                return NextResponse.json(
                    { error: 'Limite de requêtes dépassée' },
                    { status: 429, headers: { 'Retry-After': '60' } }
                );
            }

            return NextResponse.json(
                { error: "Erreur lors de l'appel à RiotApi" },
                { status: riotError.status || 500 }
            );
        }

        return NextResponse.json(
            { error: "Erreur lors de l'appel à RiotApi" },
            { status: 500 }
        );
    }
}
