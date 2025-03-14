interface FetchError extends Error {
    response?: Response;
}

export async function fetchUserByPuuid(puuid: string) {
    const response = await fetch(`/api/user/get/${puuid}`);
    // Check the status before parsing the JSON
    if (!response.ok) {
        // Add context to the error to help with debugging
        const error: FetchError = new Error(
            `HTTP error! status: ${response.status}`
        );
        error.response = response;
        throw error;
    }

    return await response.json();
}

export async function fetchUserByGameName(gameName: string, tagLine: string) {
    const encodedGameName = encodeURIComponent(gameName);
    const encodedTagLine = encodeURIComponent(tagLine);

    const response = await fetch(
        `/api/user/get/${encodedGameName}/${encodedTagLine}`
    );

    // Check the status before parsing the JSON
    if (!response.ok) {
        // Add context to the error to help with debugging
        const error: FetchError = new Error(
            `HTTP error! status: ${response.status}`
        );
        error.response = response;
        throw error;
    }

    return await response.json();
}
