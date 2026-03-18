import {inventoryCache, inventoryWaiters} from "./interceptedInventoryCache";

export const initInterceptorBridge = () => {
    window.addEventListener("message", (event) => {
        if (event.source !== window) return;
        if (event.data?.type !== "VSKIN_INVENTORY_INTERCEPTED") return;

        const {contextId, data} = event.data;

        const existing = inventoryCache.get(contextId);

        if (existing && !existing.complete && data.assets) {
            existing.data.assets.push(...data.assets);
            existing.data.descriptions.push(...(data.descriptions ?? []));
            if (data.asset_properties) {
                existing.data.asset_properties = [
                    ...(existing.data.asset_properties ?? []),
                    ...data.asset_properties,
                ];
            }
            existing.data.total_inventory_count = data.total_inventory_count;
            existing.complete = !data.more_items;
        } else {
            inventoryCache.set(contextId, {
                data,
                complete: !data.more_items,
            });
        }

        if (!data.more_items) {
            const waiters = inventoryWaiters.get(contextId);
            if (waiters) {
                waiters.forEach((resolve) => resolve());
                inventoryWaiters.delete(contextId);
            }
        }
    });
};
