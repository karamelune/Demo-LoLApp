import { NextResponse, NextRequest } from 'next/server';
import { getMatchById } from '@/services/riotApi';

type Params = {
    id: string;
};

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    const { id } = await params;

    try {
        const match = await getMatchById(id);
        return NextResponse.json(match);
    } catch (error) {
        console.error('Error fetching data from RiotApi:', error);
        return NextResponse.json(
            { error: 'Error fetching data from RiotApi' },
            { status: 500 }
        );
    }
}
