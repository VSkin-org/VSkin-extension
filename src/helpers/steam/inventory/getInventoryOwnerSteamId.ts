export const getInventoryOwnerSteamId = (): string | null => {
    const itemInfo = document.getElementById("iteminfo0");
    if (!itemInfo) return null;

    const props = itemInfo.getAttribute("data-props");
    if (!props) return null;

    const parsed = JSON.parse(props);
    return parsed.steamidOwner ?? null;
};
