import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { UserModel } from '@/models/UserModel';
import { cache } from '@/lib/cache';

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

        const cacheKey = `user:${decodedGameName}:${decodedTagLine}`;
        const cachedUser = (await cache.get(cacheKey)) as string | null;

        if (cachedUser) {
            return NextResponse.json(JSON.parse(cachedUser), {
                status: 200,
                headers: {
                    'Cache-Control': 'max-age=60, s-maxage=300',
                    'X-Cache': 'HIT',
                },
            });
        }

        await dbConnect();

        const user = await Promise.race([
            UserModel.findOne(
                { gameName: decodedGameName, tagLine: decodedTagLine },
                { matches: 0, masteries: { $slice: 10 } }
            )
                .lean()
                .exec(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Database timeout')), 5000)
            ),
        ]);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        await cache.set(cacheKey, JSON.stringify(user), 60);

        return NextResponse.json(user, {
            status: 200,
            headers: {
                'Cache-Control': 'max-age=60, s-maxage=300',
                'X-Cache': 'MISS',
            },
        });
    } catch (error: unknown) {
        console.error('Error retrieving user:', error);

        if (error instanceof Error && error.message === 'Database timeout') {
            return NextResponse.json(
                { error: 'Request timeout, database query took too long' },
                { status: 504 }
            );
        }

        return NextResponse.json(
            { error: 'Error retrieving user' },
            { status: 500 }
        );
    }
}
