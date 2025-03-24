'use client';
import { formatDistanceStrict } from 'date-fns';
import { Match } from '@/types/match';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Maximize2 } from 'lucide-react';
import {
    checkPlayerBadPerformanceBadges,
    checkPlayerGoodPerformanceBadges,
} from '../scripts/checkPlayerPerformanceBadges';
import championKeyToId from '@/data/championKeyToId.json';
import { useEffect, useState, Suspense } from 'react';
import MatchStats from './MatchStats';
import { Skeleton } from './ui/skeleton';
import { User } from '@/types/user';
import { Separator } from './ui/separator';

interface MatchInfoProps {
    matchData: Match;
    userPuuid: string;
}

// Get DDragon base URL from environment variables
const ddragonBaseUrl = process.env.DDRAGON_BASE_URL;

export default function Matches({ user }: { user: User }) {
    const [isMatchesLoading, setIsMatchesLoading] = useState(false);
    const [matches, setMatches] = useState<Match[]>([]);
    const [matchCount, setMatchCount] = useState(10);

    useEffect(() => {
        // Fetch the matches for the user
        async function fetchMatches() {
            if (!user) return;
            try {
                setIsMatchesLoading(true);
                const response = await fetch(
                    `/api/match/get/puuid/${user.puuid}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch matches');
                }
                const data = await response.json();
                const sortedMatches = data.sort(
                    (a: Match, b: Match) =>
                        b.info.gameCreation - a.info.gameCreation
                );
                // Keep only normal, ranked and aram matches
                const filteredMatches = sortedMatches.filter((match: Match) =>
                    [400, 420, 430, 440, 450, 460, 470, 900].includes(
                        match.info.queueId
                    )
                );
                setMatches(filteredMatches);
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setIsMatchesLoading(false);
            }
        }

        if (user) {
            fetchMatches();
        }
    }, [user]);

    // Slice the filtered matches to the match count
    const slicedMatches = matches?.slice(0, matchCount);
    return (
        <>
            <div className="flex flex-col gap-2 justify-center items-center p-2 rounded-md bg-gradient-to-r from-lolblue6 to-lolblue7 shadow-md px-4 py-2 w-full">
                <h2 className="font-semibold text-gray-200">Recent Matches</h2>
                <Separator className="bg-lolgray1/20 w-24 -mt-1 mb-2" />

                {user &&
                !isMatchesLoading &&
                matches.length > 0 &&
                slicedMatches ? (
                    <div className="grid grid-cols-1 gap-3 w-full">
                        {slicedMatches.map((match) => (
                            <Suspense
                                key={match.metadata.matchId}
                                fallback={<MatchInfoSkeleton />}>
                                <MatchInfo
                                    matchData={match}
                                    userPuuid={user.puuid}
                                />
                            </Suspense>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-200 text-center py-4">
                        No matches found for this summoner.
                    </div>
                )}
            </div>

            {/* Load more matches - only show if there are more matches to load */}
            {matches.length > 0 && matchCount < matches.length && (
                <button
                    className="text-gray-200 bg-gradient-to-r from-lolblue6 to-lolblue7 hover:bg-lolblue5/80 rounded-md py-1 px-2 mt-2 shadow-md"
                    onClick={() => setMatchCount(matchCount + 10)}>
                    Load more matches
                </button>
            )}
        </>
    );
}

function MatchInfo({ matchData, userPuuid }: MatchInfoProps) {
    const [isMatchStatsOpen, setIsMatchStatsOpen] = useState(false);

    // Skip rendering if queueId is 1700 (Arena)
    if (matchData.info.queueId === 1700) {
        return null;
    }

    // Open match stats modal
    const handleToggleMatchStats = () => {
        setIsMatchStatsOpen((prev) => !prev);
    };
    // Get player and team data
    const player = matchData.info.participants.find(
        (participant) => participant.puuid === userPuuid
    );
    const team = matchData.info.teams.find(
        (team) => team.teamId === player?.teamId
    );

    // If player or team data is not found, return null
    if (!player || !team) return null;

    // Get player summoner spells and items
    const summonerSpells = [player?.summoner1Id, player?.summoner2Id];

    const items = [
        player.item0,
        player.item1,
        player.item2,
        player.item3,
        player.item4,
        player.item5,
    ];

    // Calculate player CS and CS per minute
    const playerCs =
        (player.totalMinionsKilled ?? 0) + (player.neutralMinionsKilled ?? 0);
    const csPerMin = playerCs / (matchData.info.gameDuration / 60);

    // Get player performance badges and clean empty values
    let goodPerformanceBadges = Object.entries(
        checkPlayerGoodPerformanceBadges(matchData, player)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ).filter(([key, value]) => value !== '');

    // Remove Survivor badge if Immortal badge is present
    if (
        goodPerformanceBadges.some(([key]) => key === 'Survivor') &&
        goodPerformanceBadges.some(([key]) => key === 'Immortal')
    ) {
        goodPerformanceBadges = goodPerformanceBadges.filter(
            ([key]) => key !== 'Survivor'
        );
    }

    // Get bad performance badges and clean empty values
    const badPerformanceBadges = Object.entries(
        checkPlayerBadPerformanceBadges(matchData, player)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ).filter(([key, value]) => value !== '');

    // Badge descriptions
    const badgesDescriptions: Record<string, string> = {
        mostDamage: 'Did the most damage',
        mostKills: 'Got the most kills',
        mostAssists: 'Got the most assists',
        mostGold: 'Got the most gold',
        mostCs: 'Got the most CS',
        leastDeaths: 'Died the least',
        neverDied: 'Never died',
        mostVision: 'Got the most vision score',
        mostDeaths: 'Died the most',
        leastKills: 'Got the least kills',
        leastAssists: 'Got the least assists',
        leastGold: 'Got the least gold',
        leastCs: 'Got the least CS',
        leastDamage: 'Did the least damage',
        leastVision: 'Got the least vision score',
    };

    // Find champion name from champion key
    const champion = championKeyToId.find(
        (champ) => champ.key === player.championId.toString()
    );

    return (
        <>
            <div
                key={matchData.metadata.matchId}
                className={`flex lg:flex-col justify-between gap-4 items-center p-3 rounded-md border-2 border-lolgray1/10 shadow-md bg-gradient-to-r ${
                    team.win ? 'from-green-400/25' : 'from-red-400/25'
                } from-10% to-transparent to-40%`}>
                {/* Section 1 */}
                <section className="flex items-center w-1/4 lg:w-full gap-4 lg:gap-6 md:gap-4">
                    {/* Champion icon and level */}
                    <div className="relative shrink-0">
                        <div className="p-0.5 rounded-md shadow-md bg-gradient-to-br from-lolgold4 to-lolgold3">
                            <Image
                                src={`${ddragonBaseUrl}img/champion/${champion?.id}.png`}
                                width={75}
                                height={75}
                                alt="Champion icon"
                                title={champion?.id}
                                className="rounded-md overflow-hidden xl:h-[60px] xl:w-[60px] lg:h-[75px] lg:w-[75px] sm:h-[60px] sm:w-[60px]"
                            />
                        </div>
                        <div className="absolute -bottom-2 right-1 transform translate-x-1/2 p-0.5 rounded-md shadow-md bg-gradient-to-br from-lolgold4 to-lolgold3">
                            <p className=" bg-lolblue6 text-gray-200 px-1 rounded-md text-xs">
                                {player.champLevel}
                            </p>
                        </div>
                    </div>
                    {/* Game result & type */}
                    <div className="flex flex-col min-w-24">
                        {/* Game result */}
                        <p
                            className={
                                team.win ? 'text-green-400' : 'text-red-400'
                            }>
                            {team.win ? 'Victory' : 'Defeat'}
                        </p>
                        {/* Game type */}
                        <p className="text-lolgray1 text-xs">
                            {matchData.info.queueId === 420
                                ? 'Ranked'
                                : matchData.info.queueId === 430
                                ? 'Normal'
                                : 'ARAM'}
                        </p>
                        {/* KDA */}
                        <p className="text-gray-200 xl:text-sm lg:text-base">
                            <span className="text-green-400">
                                {player.kills}
                            </span>
                            /
                            <span className="text-red-400">
                                {player.deaths}
                            </span>
                            /
                            <span className="text-blue-400">
                                {player.assists}
                            </span>
                            <span className="text-lolgray1 text-xs">
                                {' '}
                                (
                                {(
                                    (player.kills + player.assists) /
                                    (player.deaths === 0 ? 1 : player.deaths)
                                ).toFixed(1)}
                                )
                            </span>
                        </p>
                    </div>
                </section>
                {/* Section 2 */}
                <section className="flex items-center w-1/2 lg:w-full gap-4 xl:gap-2 sm:gap-1">
                    <div className="grid grid-cols-2 gap-1 sm:gap-0.5">
                        {/* Summoner spells */}

                        {summonerSpells.map((spell, index) => {
                            return (
                                <div
                                    key={index}
                                    className="w-5 h-5 sm:w-4 sm:h-4 rounded-sm overflow-hidden shadow-md">
                                    <Image
                                        src={`/summoner-spells/${spell}.png`}
                                        width={20}
                                        height={20}
                                        alt="Summoner spell"
                                    />
                                </div>
                            );
                        })}
                        {/* Runes */}
                        <Image
                            src={`/runes/${player.perks.styles[0].selections[0].perk}.png`}
                            width={20}
                            height={20}
                            alt="Rune"
                            className="self-center"
                        />
                        <Image
                            src={`/runes/${player.perks.styles[1].style}.png`}
                            width={18}
                            height={18}
                            alt="Rune"
                            className="self-center"
                        />
                    </div>
                    {/* Items */}
                    <div className="grid grid-cols-6 lg:ml-auto gap-1 sm:gap-0.5">
                        {items.map((item, index) => {
                            return item ? (
                                <div
                                    key={index}
                                    className="rounded-sm overflow-hidden shadow-md">
                                    <Image
                                        src={`${ddragonBaseUrl}img/item/${item}.png`}
                                        width={32}
                                        height={32}
                                        alt="Item"
                                    />
                                </div>
                            ) : (
                                <div
                                    key={index}
                                    className="rounded-sm bg-lolgray2/20 shadow-md"></div>
                            );
                        })}
                    </div>
                </section>

                {/* Section 3 */}
                <section className="flex items-center justify-between w-1/2 lg:w-full gap-4">
                    {/* Player performance */}
                    <div className="flex flex-col items-start justify-start gap-2 rounded-xl p-2">
                        <p className="text-gray-200 text-xs sm:text-[0.65rem] bg-lolblue4/50 px-2 py-0.5 rounded-md">
                            CS: {playerCs} ({csPerMin.toFixed(1)})
                        </p>
                        {/* Performance badges */}
                        <div className="flex gap-1 flex-wrap justify-start items-center max-h-12 overflow-y-scroll">
                            {goodPerformanceBadges &&
                                goodPerformanceBadges.map(
                                    ([key, value], index) => {
                                        return (
                                            <Badge
                                                key={index}
                                                title={badgesDescriptions[key]}
                                                className="bg-green-800 px-2 py-0.5 hover:bg-green-900 text-xs sm:text-[0.65rem] cursor-pointer">
                                                {value}
                                            </Badge>
                                        );
                                    }
                                )}

                            {badPerformanceBadges &&
                                badPerformanceBadges.map(
                                    ([key, value], index) => {
                                        return (
                                            <Badge
                                                key={index}
                                                title={badgesDescriptions[key]}
                                                className="bg-red-800 px-2 py-0.5 hover:bg-red-900 text-xs sm:text-[0.65rem] cursor-pointer">
                                                {value}
                                            </Badge>
                                        );
                                    }
                                )}
                        </div>
                    </div>
                    {/* Game duration and date */}
                    <div className="flex flex-col gap-2 items-end rounded-xl ml-auto p-2 shrink-0">
                        <p className="text-lolgray1 text-xs sm:text-[0.65rem]">
                            {`${Math.floor(
                                matchData.info.gameDuration / 60
                            )}m ${
                                matchData.info.gameDuration % 60 < 10
                                    ? `0${matchData.info.gameDuration % 60}`
                                    : matchData.info.gameDuration % 60
                            }s`}
                        </p>
                        <p className="text-lolgray1 text-xs sm:text-[0.65rem]">
                            {formatDistanceStrict(
                                new Date(matchData.info.gameCreation),
                                new Date(),
                                { addSuffix: true }
                            )}
                        </p>
                    </div>
                    <button
                        aria-label="fullscreen"
                        onClick={handleToggleMatchStats}
                        className="shrink-0">
                        <Maximize2 color="#ffffff" height={20} width={20} />
                    </button>
                </section>
            </div>
            {/* Match stats collapsible */}
            {isMatchStatsOpen && (
                <div>
                    <MatchStats matchData={matchData} userPuuid={userPuuid} />
                </div>
            )}
        </>
    );
}

export function MatchInfoSkeleton() {
    return (
        <Skeleton className="flex lg:flex-col justify-between gap-4 items-center p-3 rounded-md border-2 border-lolgray1/10 shadow-md bg-gray-800 w-full">
            {/* Section 1 */}
            <section className="flex items-center w-1/4 lg:w-full gap-4 lg:gap-6 md:gap-4">
                {/* Champion icon and level */}
                <div className="relative shrink-0">
                    <div className="p-0.5 rounded-md shadow-md bg-gray-600">
                        <Skeleton className="rounded-md overflow-hidden h-[75px] w-[75px] xl:h-[60px] xl:w-[60px] lg:h-[75px] lg:w-[75px] sm:h-[60px] sm:w-[60px] bg-gray-700" />
                    </div>
                    <div className="absolute -bottom-2 right-1 transform translate-x-1/2 p-0.5 rounded-md shadow-md bg-gray-600">
                        <Skeleton className="bg-gray-700 px-1 rounded-md w-4 h-4" />
                    </div>
                </div>
                {/* Game result & type */}
                <div className="flex flex-col min-w-24">
                    <Skeleton className="h-5 w-16 mb-1 bg-gray-700" />{' '}
                    {/* Victory/Defeat */}
                    <Skeleton className="h-3 w-12 mb-1 bg-gray-700" />{' '}
                    {/* Game type */}
                    <Skeleton className="h-5 w-20 bg-gray-700" /> {/* KDA */}
                </div>
            </section>

            {/* Section 2 */}
            <section className="flex items-center w-1/2 lg:w-full gap-4 xl:gap-2 sm:gap-1">
                <div className="grid grid-cols-2 gap-1 sm:gap-0.5">
                    {/* Summoner spells */}
                    <Skeleton className="w-5 h-5 sm:w-4 sm:h-4 rounded-sm bg-gray-700" />
                    <Skeleton className="w-5 h-5 sm:w-4 sm:h-4 rounded-sm bg-gray-700" />
                    {/* Runes */}
                    <Skeleton className="w-5 h-5 sm:w-4 sm:h-4 rounded-sm bg-gray-700" />
                    <Skeleton className="w-5 h-5 sm:w-4 sm:h-4 rounded-sm bg-gray-700" />
                </div>
                {/* Items */}
                <div className="grid grid-cols-6 lg:ml-auto gap-1 sm:gap-0.5">
                    {Array(6)
                        .fill(0)
                        .map((_, index) => (
                            <Skeleton
                                key={index}
                                className="w-8 h-8 rounded-sm bg-gray-700"
                            />
                        ))}
                </div>
            </section>

            {/* Section 3 */}
            <section className="flex items-center justify-between w-1/2 lg:w-full gap-4">
                {/* Player performance */}
                <div className="flex flex-col items-start justify-start gap-2 rounded-xl p-2">
                    <Skeleton className="h-4 w-24 bg-gray-700 rounded-md" />{' '}
                    {/* CS */}
                    {/* Performance badges */}
                    <div className="flex gap-1 flex-wrap justify-start items-center">
                        <Skeleton className="h-4 w-16 bg-gray-700 rounded-md" />
                        <Skeleton className="h-4 w-12 bg-gray-700 rounded-md" />
                        <Skeleton className="h-4 w-14 bg-gray-700 rounded-md" />
                    </div>
                </div>
                {/* Game duration and date */}
                <div className="flex flex-col gap-2 items-end rounded-xl ml-auto p-2 shrink-0">
                    <Skeleton className="h-3 w-16 bg-gray-700 rounded-sm" />{' '}
                    {/* Duration */}
                    <Skeleton className="h-3 w-20 bg-gray-700 rounded-sm" />{' '}
                    {/* Date */}
                </div>
            </section>
        </Skeleton>
    );
}
