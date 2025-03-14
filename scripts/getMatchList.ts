import axios from 'axios';
import handleApiError from '../lib/handleAPIError';

/**
 * Retrieves match history list for a summoner
 * @param summonerId The summoner's unique identifier (PUUID)
 * @returns List of match IDs for the summoner
 */
export async function getMatchList(summonerId: string) {
    try {
        const encodedSummonerId = encodeURIComponent(summonerId);
        const response = await axios.get(
            `/api/match/puuid/${encodedSummonerId}`
        );
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}
