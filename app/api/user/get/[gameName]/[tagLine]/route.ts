import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { UserModel } from '@/models/UserModel';

type Params = {
    gameName: string;
    tagLine: string;
};

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<Params> }
) {
    try {
        const { gameName, tagLine } = await params;

        if (!gameName || !tagLine) {
            return NextResponse.json(
                { error: 'Missing gameName or tagLine' },
                { status: 400 }
            );
        }

        const decodedGameName = decodeURIComponent(gameName);
        const decodedTagLine = decodeURIComponent(tagLine);

        await dbConnect();

        const user = await UserModel.findOne({
            gameName: decodedGameName,
            tagLine: decodedTagLine,
        }).lean();

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const headers = new Headers();
        headers.set('Cache-Control', 'max-age=60, s-maxage=60');

        return NextResponse.json(user, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Error retrieving user:', error);
        return NextResponse.json(
            { error: 'Error retrieving user' },
            { status: 500 }
        );
    }
}
