import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { MatchModel } from '@/models/MatchModel';

export async function GET() {
    try {
        // Connect to the database
        await dbConnect();

        // Fetch all matches from the database
        const matches = await MatchModel.find({}).lean();

        // Return the matches
        return NextResponse.json(matches, { status: 200 });
    } catch (error) {
        console.error('Error fetching matches:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
