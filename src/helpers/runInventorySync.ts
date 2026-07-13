import {getSteamLoginCookie} from "./steam/inventory/getSteamLoginCookie";
import {extractSteamIdFromCookie} from "./steam/inventory/extractSteamIdFromCookie";
import {getStorageItem} from "./getStorageItem";
import {setStorageItem} from "./setStorageItem";
import {getFullSteamInventory} from "../services/Steam/getFullSteamInventory";
import {getInventorySync} from "../services/VSkinBackend/inventorySync/getInventorySync";
import {SteamInventoryResponseInterface} from "../services/Steam/types";
import {STEAM_CONTEXT_ID, STORAGE_KEYS, SCAN_COOLDOWN_SECONDS} from "../contantes";

const EMPTY_INVENTORY: SteamInventoryResponseInterface = {
    assets: [],
    descriptions: [],
    total_inventory_count: 0,
    success: true,
    rwgrsn: -1,
};

export type RunInventorySyncResult =
    | {status: "OK"; message?: string}
    | {status: "COOLDOWN"; secondsLeft: number}
    | {status: "NO_SESSION"}
    | {status: "BACKEND_ERROR"; message: string};

export const runInventorySync = async (): Promise<RunInventorySyncResult> => {
    const cooldownEnd = await getStorageItem<number>({key: STORAGE_KEYS.SCAN_COOLDOWN_END});
    if (cooldownEnd && cooldownEnd > Date.now()) {
        return {status: "COOLDOWN", secondsLeft: Math.ceil((cooldownEnd - Date.now()) / 1000)};
    }

    const cookie = await getSteamLoginCookie();
    if (!cookie) return {status: "NO_SESSION"};

    const steamId = extractSteamIdFromCookie({cookieValue: cookie.value});
    if (!steamId) return {status: "NO_SESSION"};

    try {
        const inventory = await getFullSteamInventory({
            steamId,
            contextId: STEAM_CONTEXT_ID.INVENTORY_UNPROTECTED,
        }).catch(() => EMPTY_INVENTORY);

        const response = await getInventorySync({body: {steamId, inventory}});

        await setStorageItem({
            key: STORAGE_KEYS.SCAN_COOLDOWN_END,
            value: Date.now() + SCAN_COOLDOWN_SECONDS * 1000,
        });

        return {status: "OK", message: response.message};
    } catch (error) {
        return {
            status: "BACKEND_ERROR",
            message: error instanceof Error ? error.message : "Sync failed",
        };
    }
};
