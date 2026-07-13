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

export const getFullSteamInventory = async ({
    steamId,
    contextId,
}: {
    steamId: string;
    contextId: string;
}): Promise<SteamInventoryResponseInterface> => {
    const assets = new Map<string, AssetResponseInterface>();
    const descriptions = new Map<string, DescriptionResponseInterface>();
    const assetProperties = new Map<string, AssetPropertyResponseInterface>();

    let startAssetId: string | undefined;
    let lastPage: SteamInventoryResponseInterface | undefined;

    for (let page = 0; page < MAX_PAGES; page++) {
        const response = await getSteamInventory({
            query: {steamId, contextId, startAssetId, count: PAGE_COUNT},
        });

        // Abort on a failed page rather than return a partial inventory: the backend archives
        // everything absent from the payload, so a half-fetched inventory would wrongly archive items.
        if (!response.success) {
            throw new Error("Steam inventory request failed");
        }

        lastPage = response;

        for (const asset of response.assets ?? []) {
            assets.set(asset.assetid, asset);
        }
        // Descriptions are keyed by class, not asset, and can repeat across pages, so dedup them.
        for (const description of response.descriptions ?? []) {
            descriptions.set(`${description.classid}_${description.instanceid}`, description);
        }
        for (const assetProperty of response.asset_properties ?? []) {
            assetProperties.set(assetProperty.assetid, assetProperty);
        }

        if (!response.more_items || !response.last_assetid) break;
        startAssetId = response.last_assetid;
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
