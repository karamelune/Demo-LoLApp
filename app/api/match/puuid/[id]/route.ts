import { NextResponse, NextRequest } from 'next/server';
import { getUserMatchesByPuuid } from '@/services/riotApi';

type Params = {
    id: string;
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'Missing PUUID' },
                { status: 400 }
            );
        }

        const page = parseInt(request.nextUrl.searchParams.get('page') || '1');

        const response = await getUserMatchesByPuuid(id, page);

        const headers = new Headers({
            'Cache-Control': 'public, max-age=60, s-maxage=300',
            'Content-Type': 'application/json',
        });

        return NextResponse.json(response, {
            status: 200,
            headers,
        });
    } catch (error: any) {
        console.error('Error fetching data from RiotApi:', error);

        if (error.status === 429) {
            return NextResponse.json(
                { error: 'Rate limit exceeded' },
                { status: 429, headers: { 'Retry-After': '30' } }
            );
        }

        return NextResponse.json(
            { error: 'Error fetching data from RiotApi' },
            { status: error.status || 500 }
        );
    }
}
