import axios from 'axios';
import handleApiError from '../lib/handleAPIError';

/**
 * Retrieves summoner information based on puuid
 * @param puuid The player's unique identifier
 * @returns Summoner information
 */
export async function getSummoner(puuid: string) {
    try {
        const encodedPUUID = encodeURIComponent(puuid);
        const response = await axios.get(`/api/summoner/${encodedPUUID}`);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}
