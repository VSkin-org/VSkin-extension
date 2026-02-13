export const getLoggedInSteamId = (): string | null => {
    const appConfig = document.getElementById("application_config");
    if (!appConfig) return null;

    const userInfo = appConfig.getAttribute("data-userinfo");
    if (!userInfo) return null;

    const parsed = JSON.parse(userInfo);
    return parsed.steamid ?? null;
};
