'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { User } from '@/types/user';
import { Mastery } from '@/types/mastery';
import { updateUserClient } from '@/scripts/updateUserClient';
import { fetchUserByGameName } from '@/services/userService';
import { Match } from '@/types/match';
import championKeyToId from '@/data/championKeyToId.json';
import { Separator } from '@/components/ui/separator';
import { MatchInfoSkeleton } from '@/components/MatchInfo';
import ProfileInfos, { ProfileInfosSkeleton } from '@/components/ProfileInfos';
import { ProfileMasteriesSkeleton } from '@/components/ProfileMasteries';

// Chargement différé des composants moins critiques
const ProfileMasteries = React.lazy(
    () => import('@/components/ProfileMasteries')
);
const MatchInfo = React.lazy(() => import('@/components/MatchInfo'));

type ChampionStats = {
    championKey: string;
    played: number;
    wins: number;
    losses: number;
    id: string;
    winRate: number;
};

function getChampionStats(user: User, matches: Match[]): ChampionStats[] {
    if (!user || !Array.isArray(matches) || matches.length === 0) {
        return [];
    }

    const last50Matches = matches
        .filter(
            (match) =>
                match.info.participants.some(
                    (participant) => participant.puuid === user.puuid
                ) && match.info.queueId === 420 // Solo/Duo queue
        )
        .sort((a, b) => b.info.gameCreation - a.info.gameCreation)
        .slice(0, 50);

    const championStats: Record<string, ChampionStats> = {};

    last50Matches.forEach((match) => {
        const participant = match.info.participants.find(
            (p) => p.puuid === user.puuid
        );
        if (!participant) return;

        const championKey = participant.championId.toString();
        const champion = championKeyToId.find(
            (champ) => champ.key === championKey
        );
        const championId = champion ? champion.id : championKey;

        if (!championStats[championKey]) {
            championStats[championKey] = {
                championKey: championKey,
                played: 0,
                wins: 0,
                losses: 0,
                id: championId,
                winRate: 0,
            };
        }

        championStats[championKey].played += 1;
        if (participant.win) {
            championStats[championKey].wins += 1;
        } else {
            championStats[championKey].losses += 1;
        }

        championStats[championKey].winRate =
            (championStats[championKey].wins /
                championStats[championKey].played) *
            100;
    });

    return Object.values(championStats).sort((a, b) => b.winRate - a.winRate);
}

export default function SummonerPage() {
    const { gameName, tagLine } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [isMatchesLoading, setIsMatchesLoading] = useState(false);

    const fetchUser = useCallback(async () => {
        if (typeof gameName === 'string' && typeof tagLine === 'string') {
            try {
                const fetchedUser = await fetchUserByGameName(
                    decodeURIComponent(gameName),
                    decodeURIComponent(tagLine)
                );

                if (fetchedUser.masteries) {
                    const masteries: Mastery[] = fetchedUser.masteries.map(
                        (mastery: Mastery) => ({
                            ...mastery,
                            key: Number(mastery.key),
                        })
                    );
                    setUser({ ...fetchedUser, masteries });
                }
            } catch (error: unknown) {
                if (
                    isAxiosError(error) &&
                    error.response &&
                    error.response.status === 404
                ) {
                    try {
                        const updatedUser = await updateUserClient(
                            decodeURIComponent(gameName),
                            decodeURIComponent(tagLine)
                        );
                        setUser(updatedUser);
                    } catch (updateError) {
                        console.error('Error updating user:', updateError);
                        setUser(null);
                    }
                } else {
                    console.error('Error fetching summoner:', error);
                    setUser(null);
                }
            }
        } else {
            console.error('Invalid gameName or tagLine');
            setUser(null);
        }
    }, [gameName, tagLine]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const [matches, setMatches] = useState<Match[]>([]);

    // Fetch matches when user changes
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

    // State for the number of matches to display
    const [matchCount, setMatchCount] = useState(10);

    // Base classes for the ranked tiers
    const tierBaseClasses = 'bg-clip-text text-transparent bg-gradient-to-br';

    // Colors for the ranked tiers
    const tierColors: { [key: string]: string } = {
        IRON: 'from-stone-500 to-stone-400',
        BRONZE: 'from-yellow-800 to-yellow-700',
        SILVER: 'from-zinc-400 to-zinc-300',
        GOLD: 'from-lolgold3 to-lolgold2',
        PLATINUM: 'from-teal-700 to-teal-600',
        DIAMOND: 'from-cyan-700 to-cyan-600',
        EMERALD: 'from-emerald-700 to-emerald-600',
        MASTER: 'from-fuchsia-700 to-fuchsia-600',
        GRANDMASTER: 'from-red-700 to-red-600',
        CHALLENGER: 'from-cyan-700 to-lolgold3',
    };

    // Find the solo queue league
    const rankedSolo = user?.leagues?.find(
        (league: { queueType: string }) =>
            league.queueType === 'RANKED_SOLO_5x5'
    );

    // Calculate the win rate for the solo queue
    const soloWinRate = rankedSolo
        ? (rankedSolo.wins / (rankedSolo.wins + rankedSolo.losses)) * 100
        : 0;

    // Find the color for the solo queue
    const rankedSoloColor = rankedSolo
        ? `${tierBaseClasses} ${tierColors[rankedSolo.tier]}`
        : 'text-gray-200';

    // Find the flex queue league
    const rankedFlex = user?.leagues?.find(
        (league: { queueType: string }) => league.queueType === 'RANKED_FLEX_SR'
    );

    // Calculate the win rate for the flex queue
    const flexWinRate = rankedFlex
        ? (rankedFlex.wins / (rankedFlex.wins + rankedFlex.losses)) * 100
        : 0;

    // Find the color for the flex queue
    const rankedFlexColor = rankedFlex
        ? `${tierBaseClasses} ${tierColors[rankedFlex.tier]}`
        : 'text-gray-200';

    // Sort the champion masteries by level and points
    const championMasteries = user?.masteries?.slice(0, 10).sort((a, b) => {
        if (a.championLevel === b.championLevel) {
            return b.championPoints - a.championPoints;
        }
        return b.championLevel - a.championLevel;
    });

    // Slice the filtered matches to the match count
    const slicedMatches = matches?.slice(0, matchCount);

    // Get the champion stats for the user
    const championStats = user ? getChampionStats(user, matches) : [];

    // Update the user's game name and tag line
    async function handleUpdate() {
        const updatedUser = user
            ? await updateUserClient(user.gameName, user.tagLine)
            : null;
        setUser(updatedUser);
    }

    // Check if the user is loading
    const isUserLoading = !user;

    // Check if the champion masteries are loading
    const isChampionMasteriesLoading = !championMasteries;

    // Check if the performances are loading
    const isRecentPerformanceLoading = matches.length === 0;

    return (
        <section className="flex flex-col gap-2 justify-center items-center m-auto max-w-[75vw]">
            {/* Background champion splash-art */}
            {championMasteries && championMasteries.length > 0 ? (
                <div
                    className="fixed -z-50 w-[100vw] h-[100vh] bg-cover bg-center rounded-md shadow-md top-0 left-0 blur-xl"
                    style={{
                        backgroundImage: `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championMasteries[0].id}_0.jpg)`,
                    }}></div>
            ) : (
                <div className="fixed -z-50 w-[100vw] h-[100vh] bg-cover bg-center rounded-md shadow-md top-0 left-0 blur-xl"></div>
            )}

            {/* Profile information */}
            {isUserLoading ? (
                <ProfileInfosSkeleton />
            ) : (
                <ProfileInfos
                    user={user}
                    rankedSolo={rankedSolo}
                    rankedSoloColor={rankedSoloColor}
                    soloWinRate={soloWinRate}
                    rankedFlex={rankedFlex}
                    rankedFlexColor={rankedFlexColor}
                    flexWinRate={flexWinRate}
                    handleUpdate={handleUpdate}
                />
            )}

            {/* Champion masteries */}
            {isChampionMasteriesLoading ? (
                <ProfileMasteriesSkeleton />
            ) : (
                championMasteries.length > 0 && (
                    <Suspense fallback={<ProfileMasteriesSkeleton />}>
                        <ProfileMasteries
                            championMasteries={championMasteries}
                        />
                    </Suspense>
                )
            )}

            {/* Recent performance */}
            {/* !! Currently not perfectly implemented !! */}
            {/* {isRecentPerformanceLoading ? (
                <ProfileRecentPerformanceSkeleton />
            ) : (
                championStats.length > 0 && (
                    <RecentPerformance
                        isRecentPerformanceLoading={isRecentPerformanceLoading}
                        championStats={championStats}
                        user={user}
                    />
                )
            )} */}

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
                ) : user && !isMatchesLoading && matches.length === 0 ? (
                    <div className="text-gray-200 text-center py-4">
                        No matches found for this summoner.
                    </div>
                ) : (
                    <>
                        <MatchInfoSkeleton />
                        <MatchInfoSkeleton />
                        <MatchInfoSkeleton />
                        <MatchInfoSkeleton />
                        <MatchInfoSkeleton />
                    </>
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
        </section>
    );
}

// Helper function to check if the error is an AxiosError
function isAxiosError(
    error: unknown
): error is { response: { status: number } } {
    return typeof error === 'object' && error !== null && 'response' in error;
}
