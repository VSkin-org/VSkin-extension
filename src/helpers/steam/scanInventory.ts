import {getSteamInventory} from "../../services/Steam/getSteamInventory";
import {getInventorySync} from "../../services/VSkinBackend/inventorySync/getInventorySync";
import {getLoggedInSteamId} from "./inventory/getLoggedInSteamId";
import {STEAM_CONTEXT_ID} from "../../contantes";
import { isOwnInventory } from "./inventory/isOwnInventory";

export const scanInventory = async () => {
    const steamId = getLoggedInSteamId();
    if (!steamId || !isOwnInventory()) return;

    const [items, protectedItems] = await Promise.all([
        getSteamInventory({query: {steamId, contextId: STEAM_CONTEXT_ID.INVENTORY_UNPROTECTED}}),
        getSteamInventory({query: {steamId, contextId: STEAM_CONTEXT_ID.INVENTORY_PROTECTED}}),
    ]);

    return await getInventorySync({body: {steamId, items, protectedItems}});
};
