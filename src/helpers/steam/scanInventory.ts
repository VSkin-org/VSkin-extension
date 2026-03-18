import {getSteamInventory} from "../../services/Steam/getSteamInventory";
import {SteamInventoryResponseInterface} from "../../services/Steam/types";
import {getInventorySync} from "../../services/VSkinBackend/inventorySync/getInventorySync";
import {getLoggedInSteamId} from "./inventory/getLoggedInSteamId";
import {getInterceptedInventory} from "./inventory/getInterceptedInventory";
import {STEAM_CONTEXT_ID} from "../../contantes";
import {isOwnInventory} from "./inventory/isOwnInventory";

const INTERCEPT_TIMEOUT_MS = 10_000;

const EMPTY_INVENTORY: SteamInventoryResponseInterface = {
    assets: [],
    descriptions: [],
    total_inventory_count: 0,
    success: true,
    rwgrsn: -1,
};

export const scanInventory = async () => {
    const steamId = getLoggedInSteamId();
    if (!steamId || !isOwnInventory()) return;

    const [items, protectedItems] = await Promise.all([
        getInterceptedInventory({contextId: STEAM_CONTEXT_ID.INVENTORY_UNPROTECTED, timeoutMs: INTERCEPT_TIMEOUT_MS})
            .catch(() => getSteamInventory({query: {steamId, contextId: STEAM_CONTEXT_ID.INVENTORY_UNPROTECTED}})),
        getInterceptedInventory({contextId: STEAM_CONTEXT_ID.INVENTORY_PROTECTED, timeoutMs: INTERCEPT_TIMEOUT_MS})
            .catch(() => EMPTY_INVENTORY),
    ]);

    return await getInventorySync({body: {steamId, items, protectedItems}});
};
