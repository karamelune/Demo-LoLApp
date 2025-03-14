import axios from 'axios';
import handleApiError from '../lib/handleAPIError';

/**
 * Retrieves match information based on match ID
 * @param matchId The unique identifier for the match
 * @returns Match information and statistics
 */
export async function getMatch(matchId: string) {
    try {
        const encodedMatchId = encodeURIComponent(matchId);
        const response = await axios.get(
            `/api/match/matchid/${encodedMatchId}`
        );
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
}
