import axios from 'axios';
import handleApiError from '../lib/handleAPIError';

/**
 * Retrieves league information for a summoner
 * @param summonerId The summoner's unique identifier
 * @returns League information for the summoner
 */
export async function getLeagues(summonerId: string) {
    try {
        const encodedSummonerId = encodeURIComponent(summonerId);
        const response = await axios.get(`/api/league/${encodedSummonerId}`);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}
