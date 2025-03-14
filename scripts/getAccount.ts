import axios from 'axios';
import handleApiError from '@/lib/handleAPIError';

/**
 * Retrieves account information based on game name and tag line
 * @param gameName The player's game name
 * @param tagLine The player's tag line
 * @returns Account information
 */
export async function getAccount(gameName: string, tagLine: string) {
    try {
        const encodedGameName = encodeURIComponent(gameName);
        const encodedTagLine = encodeURIComponent(tagLine);
        const url = `/api/account/${encodedGameName}/${encodedTagLine}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}
