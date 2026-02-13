import {getLoggedInSteamId} from "./getLoggedInSteamId";
import {getInventoryOwnerSteamId} from "./getInventoryOwnerSteamId";

export const isOwnInventory = (): boolean => {
    const loggedInSteamId = getLoggedInSteamId();
    const ownerSteamId = getInventoryOwnerSteamId();

    if (!loggedInSteamId || !ownerSteamId) return false;

    return loggedInSteamId === ownerSteamId;
};
