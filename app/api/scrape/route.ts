import { dbConnect } from '@/lib/dbConnect';
import { MatchModel } from '@/models/MatchModel';
import { NextResponse } from 'next/server';
import { updateUserClient } from '@/scripts/updateUserClient';

export async function GET() {
    try {
        // Connect to the database
        await dbConnect();

        const participants = await MatchModel.aggregate([
            {
                $group: {
                    _id: '$_id',
                    participants: { $first: '$metadata.participants' },
                },
            },
        ]);

        const uniqueParticipants = participants
            .map((match) => match.participants)
            .flat();
        const uniqueParticipantsSet = new Set(uniqueParticipants);

        const uniqueParticipantsArray = Array.from(uniqueParticipantsSet);

        // Randomize the order of participants
        uniqueParticipantsArray.sort(() => Math.random() - 0.5);

        // For each participant, update user client
        for (const participant of uniqueParticipantsArray) {
            await updateUserClient(undefined, undefined, participant);
        }

        return NextResponse.json(participants.slice(0, 2), { status: 200 });
    } catch (error) {
        console.error('Error fetching match:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
