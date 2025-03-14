import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { UserModel } from '@/models/UserModel';

export async function GET(
    req: NextRequest,
    { params }: { params: { gameName: string; tagLine: string } }
) {
    const { gameName, tagLine } = await params;

    const decodedGameName = decodeURIComponent(gameName);
    const decodedTagLine = decodeURIComponent(tagLine);

    if (!gameName || !tagLine) {
        return NextResponse.json(
            { error: 'Missing gameName or tagLine' },
            { status: 400 }
        );
    }

    try {
        await dbConnect();

        // Find the user by gameName and tagLine
        const user = await UserModel.findOne({
            gameName: decodedGameName,
            tagLine: decodedTagLine,
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Error retrieving user:', error);
        return NextResponse.json(
            { error: 'Error retrieving user' },
            { status: 500 }
        );
    }
}
