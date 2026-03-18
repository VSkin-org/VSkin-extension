export const getSteamLoginCookie = (): Promise<chrome.cookies.Cookie | null> => {
    return chrome.cookies.get({
        url: "https://steamcommunity.com",
        name: "steamLoginSecure",
    });
};
