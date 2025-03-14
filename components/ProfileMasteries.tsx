import { Separator } from './ui/separator';
import Image from 'next/image';
import { Mastery } from '@/types/mastery';
import { Skeleton } from './ui/skeleton';

const ddragonBaseUrl = process.env.DDRAGON_BASE_URL;

export default function ProfileMasteries({
    championMasteries,
}: {
    championMasteries: Mastery[];
}) {
    return (
        <>
            <div className="flex flex-col gap-2 justify-center items-center rounded-md px-4 py-2  bg-gradient-to-r from-lolblue6 to-lolblue7 shadow-md w-full">
                <h2 className="font-semibold text-gray-200">
                    Champion Masteries
                </h2>
                <Separator className="bg-lolgray1/20 w-28 -mt-1 mb-2" />
                <div className="grid grid-cols-5 gap-2">
                    {championMasteries.map((mastery) => (
                        <div
                            key={mastery.key}
                            className="relative flex flex-col justify-center items-center ">
                            <Image
                                src={`${ddragonBaseUrl}img/champion/${mastery.id}.png`}
                                width={60}
                                height={60}
                                title={mastery.name}
                                alt="Champion icon"
                                className="rounded-full sm:w-[50px] sm:h-[50px]"
                            />
                            <div className="absolute bottom-10 sm:bottom-9 p-0.5 z-20 rounded-xl shadow-md bg-gradient-to-br from-lolgold4 to-lolgold3">
                                <p className="text-gray-200 text-xs sm:text-[0.65rem] bg-black rounded-xl px-1 py-0">
                                    {mastery.championLevel}
                                </p>
                            </div>
                            <Image
                                src={`/masteries/Mastery_${
                                    mastery.championLevel >= 10
                                        ? '10+'
                                        : mastery.championLevel
                                }_Banner.webp`}
                                width={40}
                                height={40}
                                alt="Ranked emblem"
                                className="-mt-2 sm:w-[35px] sm:h-[35px]"
                            />
                            <p className="text-lolgray1 text-xs sm:text-[0.65rem]">
                                {mastery.championPoints.toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export function ProfileMasteriesSkeleton() {
    return (
        <div className="flex flex-col gap-2 justify-center items-center rounded-md px-4 py-2 bg-gradient-to-r from-lolblue6 to-lolblue7 shadow-md w-full">
            <h2 className="font-semibold text-gray-200">Champion Masteries</h2>
            <Separator className="bg-lolgray1/20 w-28 -mt-1 mb-2" />
            <div className="grid grid-cols-5 gap-2">
                {[...Array(10)].map((_, index) => (
                    <div
                        key={index}
                        className="relative flex flex-col justify-center items-center">
                        <Skeleton className="w-[60px] h-[60px] sm:w-[50px] sm:h-[50px] bg-gray-600 shadow-md rounded-full" />
                        <Skeleton className="w-[40px] h-[30px] sm:w-[30px] sm:h-[20px] bg-gray-600 shadow-md rounded-md -mt-2" />{' '}
                        {/* Mastery banner */}
                        <Skeleton className="w-8 h-3 bg-gray-600 shadow-md rounded-md" />{' '}
                        {/* Points */}
                    </div>
                ))}
            </div>
        </div>
    );
}
