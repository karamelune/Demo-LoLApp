import { NextResponse, NextRequest } from 'next/server';
import { getAccountByRiotId } from '@/services/riotApi';

type Params = {
    gameName: string;
    tagLine: string;
};

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    const { gameName, tagLine } = await params;

    try {
        const response = await getAccountByRiotId(gameName, tagLine);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Erreur lors de l’appel à RiotApi:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l’appel à RiotApi' },
            { status: 500 }
        );
    }
}
