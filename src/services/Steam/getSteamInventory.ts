import {get} from "../index";
import {RequestInterfaceQuery, SteamInventoryResponseInterface} from "./types";

const STEAM_ID_REGEX = /^\d{17}$/;

export const getSteamInventory = ({query}: {query: RequestInterfaceQuery}) => {
    const {steamId, contextId, startAssetId, count = 2000} = query;

    if (!STEAM_ID_REGEX.test(steamId)) {
        throw new Error('Invalid Steam ID format');
    }

    const startAssetIdParam = startAssetId ? `&start_assetid=${startAssetId}` : '';

    return get<SteamInventoryResponseInterface>({
        url: `https://steamcommunity.com/inventory/${steamId}/730/${contextId}?l=english&count=${count}&preserve_bbcode=1&raw_asset_properties=1${startAssetIdParam}`,
    });
};
