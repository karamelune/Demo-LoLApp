import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { MatchModel } from '@/models/MatchModel';

export async function GET(
    req: NextRequest,
    { params }: { params: { puuid: string } }
) {
    const { puuid } = await params;

    try {
        // Connect to the database
        await dbConnect();

        // Search for every match of the user by puuid
        const matches = await MatchModel.find({
            'metadata.participants': puuid,
        }).lean();

        if (!matches.length) {
            return NextResponse.json([]);
        }

        return NextResponse.json(matches, { status: 200 });
    } catch (error) {
        console.error('Error fetching match:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
