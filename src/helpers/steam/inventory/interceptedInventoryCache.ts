import {SteamInventoryResponseInterface} from "../../../services/Steam/types";

type CacheEntry = {
    data: SteamInventoryResponseInterface;
    complete: boolean;
};

export const inventoryCache = new Map<string, CacheEntry>();
export const inventoryWaiters = new Map<string, Array<() => void>>();
