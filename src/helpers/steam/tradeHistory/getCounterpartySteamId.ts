const STEAM_ID_64_BASE = BigInt("76561197960265728");

export const getCounterpartySteamId = ({tradeRow}: {tradeRow: HTMLElement}): string | null => {
    const link = tradeRow.querySelector(".tradehistory_event_description a[data-miniprofile]");
    if (!link) return null;

    const accountId = link.getAttribute("data-miniprofile");
    if (!accountId) return null;

    return String(STEAM_ID_64_BASE + BigInt(accountId));
};
