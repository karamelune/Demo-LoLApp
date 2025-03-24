import { LolApi, Constants, RiotApi } from 'twisted';

if (!process.env.RIOT_API_KEY) {
    throw new Error('RIOT_API_KEY is not defined');
}

const lolApi = new LolApi(process.env.RIOT_API_KEY);
const riotApi = new RiotApi(process.env.RIOT_API_KEY);

const REGION_EUROPE = Constants.RegionGroups.EUROPE;
const REGION_EU_WEST = Constants.Regions.EU_WEST;

async function handleApiCall(apiCall: Promise<any>) {
    try {
        const response = await apiCall;
        return response.response;
    } catch (error) {
        console.error('Error during RiotApi call', error);
        throw new Error('Error during RiotApi call');
    }
}

export async function getAccountByRiotId(gameName: string, tagLine: string) {
    return handleApiCall(
        riotApi.Account.getByRiotId(gameName, tagLine, REGION_EUROPE)
    );
}

export async function getAccountByPuuid(puuid: string) {
    return handleApiCall(riotApi.Account.getByPUUID(puuid, REGION_EUROPE));
}

export async function getSummonerByPUUID(puuid: string) {
    return handleApiCall(lolApi.Summoner.getByPUUID(puuid, REGION_EU_WEST));
}

export async function getMatchById(id: string) {
    return handleApiCall(lolApi.MatchV5.get(id, REGION_EUROPE));
}

export async function getUserMatchesByPuuid(puuid: string, page = 1) {
    return handleApiCall(
        lolApi.MatchV5.list(puuid, REGION_EUROPE, {
            count: 10,
            start: (page - 1) * 10,
        })
    );
}

export async function getLeagueBySummonerId(summonerId: string) {
    return handleApiCall(lolApi.League.bySummoner(summonerId, REGION_EU_WEST));
}

export async function getChampionMasteryByPUUID(puuid: string) {
    return handleApiCall(lolApi.Champion.masteryByPUUID(puuid, REGION_EU_WEST));
}
