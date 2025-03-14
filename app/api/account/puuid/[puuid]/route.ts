import { NextResponse, NextRequest } from 'next/server';
import { getAccountByPuuid } from '@/services/riotApi';

type Params = {
    puuid: string;
};

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    const { puuid } = await params;

    try {
        const response = await getAccountByPuuid(puuid);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Erreur lors de l’appel à RiotApi:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l’appel à RiotApi' },
            { status: 500 }
        );
    }
}
