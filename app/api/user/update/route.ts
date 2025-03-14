import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { UserModel } from '@/models/UserModel';

export async function POST(req: NextRequest) {
    const { updatedSummoner } = await req.json();

    if (!updatedSummoner) {
        return NextResponse.json(
            { error: 'Missing updatedSummoner' },
            { status: 400 }
        );
    }

    try {
        await dbConnect();

        // Check if the user already exists
        const existingUser = await UserModel.findOne({
            puuid: updatedSummoner.puuid,
        });

        if (existingUser) {
            // Update the existing user
            await UserModel.updateOne(
                { puuid: updatedSummoner.puuid },
                { $set: updatedSummoner }
            );
        } else {
            // Create a new user
            const newUser = new UserModel(updatedSummoner);
            await newUser.save();
        }

        return NextResponse.json(updatedSummoner, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Error updating user' },
            { status: 500 }
        );
    }
}
