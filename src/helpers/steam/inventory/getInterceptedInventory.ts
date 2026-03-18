import {SteamInventoryResponseInterface} from "../../../services/Steam/types";
import {inventoryCache, inventoryWaiters} from "./interceptedInventoryCache";

export const getInterceptedInventory = ({contextId, timeoutMs}: {contextId: string; timeoutMs: number}): Promise<SteamInventoryResponseInterface> => {
    return new Promise((resolve, reject) => {
        const entry = inventoryCache.get(contextId);

        if (entry?.complete) {
            resolve(entry.data);
            return;
        }

        const timeout = setTimeout(() => {
            const waiters = inventoryWaiters.get(contextId);
            if (waiters) {
                const index = waiters.indexOf(onComplete);
                if (index !== -1) waiters.splice(index, 1);
            }
            reject(new Error(`Intercepted inventory timeout for contextId ${contextId}`));
        }, timeoutMs);

        const onComplete = () => {
            clearTimeout(timeout);
            const entry = inventoryCache.get(contextId);
            if (entry) {
                resolve(entry.data);
            } else {
                reject(new Error(`No intercepted data for contextId ${contextId}`));
            }
        };

        const existing = inventoryWaiters.get(contextId) ?? [];
        existing.push(onComplete);
        inventoryWaiters.set(contextId, existing);
    });
};
