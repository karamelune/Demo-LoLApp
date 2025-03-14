import axios, { AxiosError } from 'axios';

/**
 * Error messages for different HTTP status codes
 */
const ERROR_MESSAGES = {
    400: 'Bad request.',
    401: 'Not authorized.',
    404: 'Not found.',
    500: 'Internal server error. Please try again later.',
    default: 'Unexpected error occurred.',
};

/**
 * Handles errors from API requests
 */
export default function handleApiError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
            const status = axiosError.response.status;
            const message =
                ERROR_MESSAGES[status as keyof typeof ERROR_MESSAGES] ||
                `${ERROR_MESSAGES.default} Status: ${status}`;
            throw new Error(message);
        }

        if (axiosError.request) {
            throw new Error(
                'No response from the server. Please check your network connection.'
            );
        }

        throw new Error(`Query error: ${axiosError.message}`);
    }

    console.error('Error fetching account:', error);
    throw new Error(
        'Account recovery failed: An unexpected error has occurred'
    );
}
