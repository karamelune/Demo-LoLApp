import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { MatchModel } from '@/models/MatchModel';

type Params = { matchId: string };

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const { matchId } = await params;

    try {
        // Connect to the database
        await dbConnect();

        // Search for the match by matchId
        const match = await MatchModel.findOne({
            'metadata.matchId': matchId,
        }).lean();

        if (!match) {
            return NextResponse.json([]);
        }

        return NextResponse.json(match, { status: 200 });
    } catch (error) {
        console.error('Error fetching match:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
