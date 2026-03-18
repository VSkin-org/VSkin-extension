export const extractSteamIdFromCookie = ({cookieValue}: {cookieValue: string}): string | null => {
    const steamId = cookieValue.split("%7C")[0];
    return steamId || null;
};
