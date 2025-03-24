import { NextResponse, NextRequest } from 'next/server';
import { getSummonerByPUUID } from '@/services/riotApi';

type Params = {
    puuid: string;
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const { puuid } = await params;

    try {
        const encodedPUUID = encodeURIComponent(puuid);
        const response = await getSummonerByPUUID(encodedPUUID);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Erreur lors de l’appel à RiotApi:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l’appel à RiotApi' },
            { status: 500 }
        );
    }
}
