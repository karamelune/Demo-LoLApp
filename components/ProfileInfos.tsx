import Image from 'next/image';
import { User } from '@/types/user';
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';

const ddragonBaseUrl = process.env.DDRAGON_BASE_URL;

type ProfileInfosParams = {
    user: User;
    rankedSolo: any;
    rankedFlex: any;
    soloWinRate: number;
    flexWinRate: number;
    rankedSoloColor: string;
    rankedFlexColor: string;
    handleUpdate: () => void;
};

export default function ProfileInfos({
    user,
    rankedSolo,
    rankedFlex,
    soloWinRate,
    flexWinRate,
    rankedSoloColor,
    rankedFlexColor,
    handleUpdate,
}: ProfileInfosParams) {
    return (
        <div className="flex sm:flex-col gap-4 justify-center items-center rounded-md bg-gradient-to-r from-lolblue6 to-lolblue7 shadow-md px-4 py-2 min-h-44 w-full">
            {/* Section 1 */}
            <section className="flex gap-4 justify-center items-center">
                <div className="relative">
                    {/* Profile icon and level */}
                    <div className="p-0.5 rounded-xl shadow-md bg-gradient-to-br from-lolgold4 to-lolgold3">
                        <Image
                            src={`${ddragonBaseUrl}img/profileicon/${user.profileIconId}.png`}
                            width={80}
                            height={80}
                            alt="Profile icon"
                            loading="eager"
                            className="rounded-xl sm:h-[80px] sm:w-[80px]"
                        />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 p-0.5 rounded-md shadow-md bg-gradient-to-br from-lolgold4 to-lolgold3">
                        <p className="bg-lolblue6 text-gray-200 px-1 rounded-md shadow-md md:text-sm sm:text-xs">
                            {user.summonerLevel}
                        </p>
                    </div>
                </div>
                {/* user name and tag */}
                <div className="mr-4 sm:mr-1">
                    <h1 className="text-3xl md:text-2xl sm:text-lg font-bold text-gray-200">
                        {user.gameName}
                    </h1>
                    <p className="text-xl md:text-lg sm:text-base text-lolgray1">
                        #{user.tagLine}
                    </p>
                    {/* Update button */}
                    <button
                        className="text-gray-100 bg-gradient-to-br from-lolgold4 to-lolgold3 rounded-md py-1 px-2 mt-2 shadow-md md:text-sm sm:text-xs hover:scale-105 transition-transform duration-200"
                        onClick={handleUpdate}>
                        Update
                    </button>
                </div>
            </section>

            <Separator
                className="bg-lolgray1/20 h-12 sm:h-[1px] sm:w-24 sm:my-2"
                orientation="vertical"
            />

            {/* Ranks */}
            <section className="flex justify-center items-center">
                <div className="flex gap-2 ml-4 sm:ml-1 justify-center items-center">
                    {/* Solo queue */}
                    <div className="flex flex-col gap-2 justify-center items-center rounded-xl p-2 sm:p-1">
                        {rankedSolo ? (
                            <div className="flex flex-col justify-center items-center">
                                <Image
                                    className="-mt-6 -mb-2"
                                    src={`/ranked-emblems/Rank=${rankedSolo.tier}.png`}
                                    width={75}
                                    height={75}
                                    title={rankedSolo.tier}
                                    alt="Ranked emblem"
                                />
                                <div className="flex flex-col justify-center items-center">
                                    <h2 className="font-semibold text-gray-200 md:text-sm sm:text-xs">
                                        Solo/Duo
                                    </h2>
                                    <h3
                                        className={`text-lg md:text-base sm:text-sm ${rankedSoloColor}`}>
                                        {rankedSolo.tier} {rankedSolo.rank}
                                    </h3>
                                    <p className="text-lolgray1 md:text-sm sm:text-xs">
                                        {rankedSolo.leaguePoints}LP
                                    </p>
                                    <p className="text-lolgray1 md:text-sm sm:text-xs">
                                        {rankedSolo.wins}W / {rankedSolo.losses}
                                        L ({soloWinRate.toFixed(0)}%)
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl md:text-lg sm:text-sm text-gray-200">
                                    Unranked
                                </h3>
                            </div>
                        )}
                    </div>
                    {/* Flex queue */}
                    <div className="flex flex-col gap-2 justify-center items-center rounded-xl p-2 sm:p-1">
                        {rankedFlex ? (
                            <div className="flex flex-col justify-center items-center">
                                <Image
                                    className="-mt-6 -mb-2"
                                    src={`/ranked-emblems/Rank=${rankedFlex.tier}.png`}
                                    width={75}
                                    height={75}
                                    title={rankedFlex.tier}
                                    alt="Ranked emblem"
                                />
                                <div className="flex flex-col justify-center items-center">
                                    <h2 className="font-semibold text-gray-200 md:text-sm sm:text-xs">
                                        Flex
                                    </h2>
                                    <h3
                                        className={`text-lg md:text-base sm:text-sm ${rankedFlexColor}`}>
                                        {rankedFlex.tier} {rankedFlex.rank}
                                    </h3>
                                    <p className="text-lolgray1 md:text-sm sm:text-xs">
                                        {rankedFlex.leaguePoints}LP
                                    </p>
                                    <p className="text-lolgray1 md:text-sm sm:text-xs">
                                        {rankedFlex.wins}W / {rankedFlex.losses}
                                        L ({flexWinRate.toFixed(0)}%)
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </section>
        </div>
    );
}

export function ProfileInfosSkeleton() {
    return (
        <div className="flex sm:flex-col gap-4 justify-center items-center rounded-md bg-gradient-to-r from-lolblue6 to-lolblue7 shadow-md px-4 py-2 min-h-44 w-full">
            {/* Section 1 */}
            <section className="flex gap-4 justify-center items-center">
                <div className="relative">
                    {/* Profile icon and level */}
                    <div className="p-0.5 rounded-xl shadow-md bg-gray-500">
                        <Skeleton className="rounded-xl w-[80px] h-[80px] bg-gray-600" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 p-0.5 rounded-md shadow-md bg-gray-500">
                        <Skeleton className="bg-gray-600 px-1 rounded-md w-8 h-5 md:h-4 sm:h-4 md:text-sm sm:text-xs" />
                    </div>
                </div>
                {/* user name and tag */}
                <div className="mr-4 sm:mr-1">
                    <Skeleton className="w-40 h-8 md:h-7 sm:h-6 bg-gray-600 rounded-md shadow-md mb-1" />{' '}
                    {/* Game name */}
                    <Skeleton className="w-28 h-6 md:h-5 sm:h-4 bg-gray-600 rounded-md shadow-md mb-2" />{' '}
                    {/* Tag line */}
                    <Skeleton className="w-24 h-8 md:h-7 sm:h-6 bg-gray-600 rounded-md shadow-md" />{' '}
                    {/* Update button */}
                </div>
            </section>

            <Separator
                className="bg-lolgray1/20 h-12 sm:h-[1px] sm:w-24 sm:my-2"
                orientation="vertical"
            />

            {/* Ranks */}
            <section className="flex justify-center items-center">
                <div className="flex gap-2 ml-4 sm:ml-1 justify-center items-center">
                    {/* Solo queue */}
                    <div className="flex flex-col gap-2 justify-center items-center rounded-xl p-2 sm:p-1">
                        <Skeleton className="w-[75px] h-[75px] bg-gray-600 rounded-full shadow-md mb-2" />{' '}
                        {/* Rank emblem */}
                        <div className="flex flex-col justify-center items-center">
                            <Skeleton className="w-20 h-4 md:h-3 sm:h-3 bg-gray-600 rounded-md shadow-md mb-1" />{' '}
                            {/* Solo/Duo */}
                            <Skeleton className="w-28 h-6 md:h-5 sm:h-4 bg-gray-600 rounded-md shadow-md mb-1" />{' '}
                            {/* Tier + Rank */}
                            <Skeleton className="w-16 h-4 md:h-3 sm:h-3 bg-gray-600 rounded-md shadow-md mb-1" />{' '}
                            {/* LP */}
                            <Skeleton className="w-32 h-4 md:h-3 sm:h-3 bg-gray-600 rounded-md shadow-md" />{' '}
                            {/* Win/Loss */}
                        </div>
                    </div>

                    {/* Flex queue */}
                    <div className="flex flex-col gap-2 justify-center items-center rounded-xl p-2 sm:p-1">
                        <Skeleton className="w-[75px] h-[75px] bg-gray-600 rounded-full shadow-md mb-2" />{' '}
                        {/* Rank emblem */}
                        <div className="flex flex-col justify-center items-center">
                            <Skeleton className="w-16 h-4 md:h-3 sm:h-3 bg-gray-600 rounded-md shadow-md mb-1" />{' '}
                            {/* Flex */}
                            <Skeleton className="w-28 h-6 md:h-5 sm:h-4 bg-gray-600 rounded-md shadow-md mb-1" />{' '}
                            {/* Tier + Rank */}
                            <Skeleton className="w-16 h-4 md:h-3 sm:h-3 bg-gray-600 rounded-md shadow-md mb-1" />{' '}
                            {/* LP */}
                            <Skeleton className="w-32 h-4 md:h-3 sm:h-3 bg-gray-600 rounded-md shadow-md" />{' '}
                            {/* Win/Loss */}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
