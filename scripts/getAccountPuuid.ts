import axios from 'axios';
import handleApiError from '@/lib/handleAPIError';

/**
 * Retrieves account information based on puuid
 * @param puuid The player's puuid
 * @returns Account information
 */
export async function getAccount(puuid: string) {
    try {
        const encodedPuuid = encodeURIComponent(puuid);
        const url = `/api/account/puuid/${encodedPuuid}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}
