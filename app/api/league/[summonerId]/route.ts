import { NextResponse, NextRequest } from 'next/server';
import { getLeagueBySummonerId } from '@/services/riotApi';

type Params = {
    summonerId: string;
};

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    const { summonerId } = await params;

    try {
        const response = await getLeagueBySummonerId(summonerId);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching data from RiotApi:', error);
        return NextResponse.json(
            { error: 'Error fetching data from RiotApi' },
            { status: 500 }
        );
    }
}
