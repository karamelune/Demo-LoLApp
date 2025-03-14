import axios from 'axios';
import { Match } from '@/types/match';
import handleApiError from '../lib/handleAPIError';

/**
 * Updates match details in the database
 * @param matchDetails Array of match information to be updated
 * @returns Response from the update operation
 */
export async function updateMatchesClient(matchDetails: Match[]) {
    try {
        const response = await axios.post(
            '/api/match/update',
            { matchDetails },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}
