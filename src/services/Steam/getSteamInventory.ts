import {get} from "../index";
import {RequestInterfaceQuery, SteamInventoryResponseInterface} from "./types";

export const getSteamInventory = ({query}: {query: RequestInterfaceQuery}) => {
    const {steamId, contextId} = query;
    return get<SteamInventoryResponseInterface>({
        url: `https://steamcommunity.com/inventory/${steamId}/730/${contextId}?l=english&count=2000&preserve_bbcode=1&raw_asset_properties=1`,
    });
};
