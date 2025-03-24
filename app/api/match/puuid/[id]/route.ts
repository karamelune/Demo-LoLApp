import { NextResponse, NextRequest } from 'next/server';
import { getUserMatchesByPuuid } from '@/services/riotApi';

type Params = {
    id: string;
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const { id } = await params;

    try {
        const response = await getUserMatchesByPuuid(id);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching data from RiotApi:', error);
        return NextResponse.json(
            { error: 'Error fetching data from RiotApi' },
            { status: 500 }
        );
    }
}
