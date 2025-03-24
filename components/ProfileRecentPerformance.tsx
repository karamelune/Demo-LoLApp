import Image from 'next/image';
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';
import { Mastery } from '@/types/mastery';

const ddragonBaseUrl = process.env.DDRAGON_BASE_URL;

interface RecentPerformanceProps {
    isRecentPerformanceLoading: boolean;
    championStats: Array<any>;
    user: any;
}

export default function RecentPerformance({
    isRecentPerformanceLoading,
    championStats,
    user,
}: RecentPerformanceProps) {
    return (
        <div className="w-full">
            {/* Recent performance */}
            {isRecentPerformanceLoading ? (
                <div className="flex flex-col gap-2 justify-center items-center p-2 rounded-md bg-gradient-to-r from-lolblue6 to-lolblue7 shadow-md w-full px-4 py-2">
                    <h2 className="font-semibold text-gray-200">
                        Recent Performance
                    </h2>
                    <Separator className="bg-lolgray1/20 w-24 -mt-1 mb-2" />
                    <div className="flex mb-8 gap-6 justify-center items-center w-full">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="flex gap-2">
                                <div className="flex flex-col relative justify-center items-center">
                                    <Skeleton className="w-[80px] h-[80px] bg-gray-600 shadow-md rounded-full" />
                                </div>
                                <div className="flex flex-col justify-center gap-1">
                                    <Skeleton className="w-16 h-4 bg-gray-600 rounded-md shadow-md" />
                                    <Skeleton className="w-16 h-4 bg-gray-600 rounded-md shadow-md" />
                                    <Skeleton className="w-16 h-4 bg-gray-600 rounded-md shadow-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                championStats.length > 0 && (
                    <div className="flex flex-col gap-2 justify-center items-center p-2 rounded-md bg-gradient-to-r from-lolblue6 to-lolblue7 shadow-md w-full px-4 py-2">
                        <h2 className="font-semibold text-gray-200">
                            Recent Performance
                        </h2>
                        <Separator className="bg-lolgray1/20 w-24 -mt-1 mb-2" />
                        <div className="flex gap-8 justify-center items-center w-full"> 
                            {championStats.slice(0, 4).map((stats) => {
                                const mastery = user?.masteries.find(
                                    (m: Mastery) => m.key === parseInt(stats.championKey)
                                );

                                const winRateClass =
                                    stats.winRate > 59
                                        ? 'text-lolgold2'
                                        : stats.winRate < 49
                                        ? 'text-red-600'
                                        : 'text-gray-200';

                                return (
                                    <div
                                        key={stats.championKey}
                                        className="text-gray-200 flex gap-2">
                                        <div className="flex flex-col relative justify-center items-center">
                                            <Image
                                                src={`${ddragonBaseUrl}img/champion/${stats.id}.png`}
                                                width={80}
                                                height={80}
                                                title={stats.id}
                                                alt="Champion icon"
                                                className="rounded-full"
                                            />
                                            {mastery && (
                                                <>
                                                    <div className="z-20 absolute bottom-7 p-0.5 rounded-full shadow-md bg-gradient-to-br from-lolgold4 to-lolgold3">
                                                        <p
                                                            className="text-gray-200 text-xs bg-black rounded-xl px-1 py-0 shadow-md"
                                                            title={`${mastery.championPoints.toLocaleString()} pts`}>
                                                            {
                                                                mastery.championLevel
                                                            }
                                                        </p>
                                                    </div>
                                                    <Image
                                                        className="-mt-4"
                                                        src={`/masteries/Mastery_${
                                                            mastery.championLevel >=
                                                            10
                                                                ? '10+'
                                                                : mastery.championLevel
                                                        }_Banner.webp`}
                                                        width={50}
                                                        height={50}
                                                        alt="Ranked emblem"
                                                        title={`${mastery.championPoints.toLocaleString()} pts`}
                                                    />
                                                </>
                                            )}
                                        </div>
                                        <div className="flex flex-col text-lolgray1 justify-center text-sm">
                                            <p className={winRateClass}>
                                                WR: {stats.winRate.toFixed(0)}%
                                            </p>
                                            <p>Played: {stats.played}</p>
                                            <p>
                                                W/L:{' '}
                                                <span className="text-green-600">
                                                    {stats.wins}
                                                </span>
                                                /
                                                <span className="text-red-600">
                                                    {stats.losses}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            )}
        </div>
    );
}

export function ProfileRecentPerformanceSkeleton() {
    return (
        <div className="flex flex-col gap-2 justify-center items-center p-2 rounded-md bg-gradient-to-r from-lolblue6 to-lolblue7 shadow-md w-full px-4 py-2">
            <h2 className="font-semibold text-gray-200">Recent Performance</h2>
            <Separator className="bg-lolgray1/20 w-24 -mt-1 mb-2" />
            <div className="flex mb-8 gap-6 justify-center items-center w-full">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex gap-2">
                        <div className="flex flex-col relative justify-center items-center">
                            <Skeleton className="w-[80px] h-[80px] bg-gray-600 shadow-md rounded-full" />
                        </div>
                        <div className="flex flex-col justify-center gap-1">
                            <Skeleton className="w-16 h-4 bg-gray-600 rounded-md shadow-md" />
                            <Skeleton className="w-16 h-4 bg-gray-600 rounded-md shadow-md" />
                            <Skeleton className="w-16 h-4 bg-gray-600 rounded-md shadow-md" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
