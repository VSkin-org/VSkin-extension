import {getSteamInventory} from "./getSteamInventory";
import {
    AssetPropertyResponseInterface,
    AssetResponseInterface,
    DescriptionResponseInterface,
    SteamInventoryResponseInterface,
} from "./types";

const PAGE_COUNT = 2500;
// Steam chunks the inventory: a page can return fewer items than requested and still set
// `more_items`, so we follow the `last_assetid` cursor until it disappears. The cap is a safety
// net against an unexpected non-terminating response.
const MAX_PAGES = 30;

// Steam has served trade-locked items two ways: from context 16, then, after its 2026-07 change,
// from the `start_assetid` pages of context 2. Both are live again, so we walk every context given
// and let the maps below drop anything that comes back twice. A context holding nothing answers
// `{"success":1}` with no `assets`, so it costs one request and merges to nothing.
export const getFullSteamInventory = async ({
    steamId,
    contextIds,
}: {
    steamId: string;
    contextIds: Array<string>;
}): Promise<SteamInventoryResponseInterface> => {
    const assets = new Map<string, AssetResponseInterface>();
    const descriptions = new Map<string, DescriptionResponseInterface>();
    const assetProperties = new Map<string, AssetPropertyResponseInterface>();

    let lastPage: SteamInventoryResponseInterface | undefined;

    for (const contextId of contextIds) {
        let startAssetId: string | undefined;

        for (let page = 0; page < MAX_PAGES; page++) {
            const response = await getSteamInventory({
                query: {steamId, contextId, startAssetId, count: PAGE_COUNT},
            });

            // A failed page leaves a hole nothing downstream can detect, and this payload is meant to
            // be a complete snapshot, so give up rather than send a truncated one.
            if (!response.success) {
                throw new Error("Steam inventory request failed");
            }

            lastPage = response;

            for (const asset of response.assets ?? []) {
                assets.set(asset.assetid, asset);
            }
            // Steam keys descriptions by class, not by asset, and repeats them across pages and
            // contexts. One entry per key keeps the merged payload in the shape a single response
            // would have had.
            for (const description of response.descriptions ?? []) {
                descriptions.set(`${description.classid}_${description.instanceid}`, description);
            }
            for (const assetProperty of response.asset_properties ?? []) {
                assetProperties.set(assetProperty.assetid, assetProperty);
            }

            if (!response.more_items || !response.last_assetid) break;
            startAssetId = response.last_assetid;
        }
    }

    return {
        assets: [...assets.values()],
        descriptions: [...descriptions.values()],
        asset_properties: [...assetProperties.values()],
        total_inventory_count: assets.size,
        success: lastPage?.success ?? true,
        rwgrsn: lastPage?.rwgrsn ?? -2,
    };
};
