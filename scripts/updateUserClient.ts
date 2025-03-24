import axios from 'axios';
import { getAccount } from './getAccount';
import { getSummoner } from './getSummoner';
import { getLeagues } from './getLeagues';
import { getMatchList } from './getMatchList';
import { getChampionMasteries } from './getChampionMasteries';
import championsData from '@/data/champion.json';
import { getMatch } from './getMatch';
import { updateMatchesClient } from './updateMatchesClient';
import { getAccountByPuuid } from '@/services/riotApi';
import handleApiError from '../lib/handleAPIError';

interface Champion {
    key: string;
    id: string;
    name: string;
    title: string;
}

interface Mastery {
    championId: string;
    championLevel: number;
    championPoints: number;
}

interface ChampionsData {
    [key: string]: Champion;
}

// Only extract champion data
const champions: ChampionsData = Object.keys(championsData.data).reduce(
    (acc, key) => {
        const champion =
            championsData.data[key as keyof typeof championsData.data];
        acc[champion.key] = {
            key: champion.key,
            id: champion.id,
            name: champion.name,
            title: champion.title,
        };
        return acc;
    },
    {} as ChampionsData
);

/**
 * Updates user information in the database
 * @param gameName The player's game name (optional if puuid is provided)
 * @param tagLine The player's tag line (optional if puuid is provided)
 * @param puuid The player's unique identifier (optional if gameName and tagLine are provided)
 * @returns Response from the update operation
 */
export async function updateUserClient(
    gameName?: string,
    tagLine?: string,
    puuid?: string
) {
    try {
        let accountPuuid: string;
        let account:
            | { gameName: string; tagLine: string; puuid: string }
            | undefined;

        if (puuid) {
            accountPuuid = puuid;
            account = await getAccountByPuuid(puuid);
            if (!account) {
                throw new Error('Account not found');
            }
        } else if (gameName && tagLine) {
            account = await getAccount(gameName, tagLine);
            if (!account) {
                throw new Error('Account not found');
            }
            accountPuuid = account.puuid;
        } else {
            throw new Error(
                'Either puuid or both gameName and tagLine must be provided'
            );
        }

        const summoner = await getSummoner(accountPuuid);
        if (!summoner) {
            throw new Error('Summoner not found');
        }

        const [leagues, matches, masteries] = await Promise.all([
            getLeagues(summoner.id),
            getMatchList(accountPuuid),
            getChampionMasteries(accountPuuid),
        ]);

        const matchesInDBIds = await Promise.all(
            matches.map(async (matchId: string) => {
                try {
                    const response = await axios.get(
                        `/api/match/get/matchId/${matchId}`
                    );
                    return response.data.metadata ? matchId : null;
                } catch (error) {
                    console.error(`Error fetching matchId ${matchId}:`, error);
                    return null;
                }
            })
        );

        const unfetchedMatches = matches.filter(
            (matchId: string) => !matchesInDBIds.includes(matchId)
        );

        const matchDetails = await Promise.all(
            unfetchedMatches.slice(0, 5).map(async (matchId: string) => {
                try {
                    return await getMatch(matchId);
                } catch (error) {
                    console.error(
                        `Error fetching match details for matchId ${matchId}:`,
                        error
                    );
                    return null;
                }
            })
        );

        // Create a champion map from the champions array
        const championMap: { [key: string]: Champion } = Object.values(
            champions
        ).reduce((map, champion) => {
            map[champion.key] = champion;
            return map;
        }, {} as { [key: string]: Champion });

        const filteredMasteries = masteries.map((mastery: Mastery) => {
            const champion = championMap[mastery.championId];
            if (!champion) {
                console.error(
                    `Champion not found for championId: ${mastery.championId}`
                );
                return {
                    key: mastery.championId,
                    id: 'Unknown',
                    name: 'Unknown',
                    title: 'Unknown',
                    championLevel: mastery.championLevel,
                    championPoints: mastery.championPoints,
                };
            }
            return {
                key: champion.key,
                id: champion.id,
                name: champion.name,
                title: champion.title,
                championLevel: mastery.championLevel,
                championPoints: mastery.championPoints,
            };
        });

        const updatedSummoner = {
            ...summoner,
            gameName: account.gameName,
            tagLine: account.tagLine,
            leagues,
            masteries: filteredMasteries,
            matches,
        };

        const response = await axios.post(
            '/api/user/update',
            {
                updatedSummoner,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // Send the match details to the updateMatchesClient
        await updateMatchesClient(matchDetails);

        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}
