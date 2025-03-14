import axios from 'axios';
import handleApiError from '../lib/handleAPIError';

/**
 * Retrieves champion mastery information for a player
 * @param puuid The player's unique identifier
 * @returns Champion mastery data for the specified player
 */
export async function getChampionMasteries(puuid: string) {
    try {
        const response = await axios.get(`/api/champion-mastery/${puuid}`);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}
