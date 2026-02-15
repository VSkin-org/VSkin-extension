import {getSteamInventory} from "../../services/Steam/getSteamInventory";
import {getInventorySync} from "../../services/VSkinBackend/inventorySync/getInventorySync";
import {computeHash} from "../computeHash";
import {getStorageItem} from "../getStorageItem";
import {isInventoryUpToDate} from "../isInventoryUpToDate";
import {setStorageItem} from "../setStorageItem";
import {getLoggedInSteamId} from "./inventory/getLoggedInSteamId";
import {STEAM_CONTEXT_ID, STORAGE_KEYS} from "../../contantes";
import {isOwnInventory} from "./inventory/isOwnInventory";

export const scanInventory = async () => {
    const steamId = getLoggedInSteamId();
    if (!steamId || !isOwnInventory()) return;

    const [items, protectedItems] = await Promise.all([
        getSteamInventory({query: {steamId, contextId: STEAM_CONTEXT_ID.INVENTORY_UNPROTECTED}}),
        getSteamInventory({query: {steamId, contextId: STEAM_CONTEXT_ID.INVENTORY_PROTECTED}}),
    ]);

    const [itemsHash, protectedItemsHash, cachedItemsHash, cachedProtectedItemsHash] = await Promise.all([
        computeHash({data: items}),
        computeHash({data: protectedItems}),
        getStorageItem<string>({key: STORAGE_KEYS.ITEMS_HASH}),
        getStorageItem<string>({key: STORAGE_KEYS.PROTECTED_ITEMS_HASH}),
    ]);

    if (isInventoryUpToDate({
        currentHashes: [itemsHash, protectedItemsHash],
        cachedHashes: [cachedItemsHash, cachedProtectedItemsHash],
    })) {
        console.log("Inventory is up to date");
        return;
    };

    await Promise.all([
        setStorageItem({key: STORAGE_KEYS.ITEMS_HASH, value: itemsHash}),
        setStorageItem({key: STORAGE_KEYS.PROTECTED_ITEMS_HASH, value: protectedItemsHash}),
    ]);

    return await getInventorySync({body: {steamId, items, protectedItems}});
};
