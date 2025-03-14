import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { MatchModel } from '@/models/MatchModel';
import { Match } from '@/types/match';

export async function POST(req: NextRequest) {
    const { matchDetails } = await req.json();

    if (!matchDetails) {
        return NextResponse.json(
            { error: 'Missing matchDetails' },
            { status: 400 }
        );
    }

    try {
        // Connect to the database
        await dbConnect();

        const processMatch = async (matchDetail: Match) => {
            // Find the match by matchId and update it if it exists
            await MatchModel.findOneAndUpdate(
                { 'metadata.matchId': matchDetail.metadata.matchId },
                matchDetail,
                { upsert: true, new: true } // Create a new document if it doesn't exist
            );
        };

        // Process one or multiple match details
        if (Array.isArray(matchDetails)) {
            await Promise.all(matchDetails.map(processMatch));
        } else {
            await processMatch(matchDetails);
        }

        return NextResponse.json(
            { message: 'Match details successfully saved.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error saving match details:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
