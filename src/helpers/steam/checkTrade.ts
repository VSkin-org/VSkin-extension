import {getLoggedInSteamId} from "./tradeHistory/getLoggedInSteamId";
import {getCounterpartySteamId} from "./tradeHistory/getCounterpartySteamId";
import {getTradeDate} from "./tradeHistory/getTradeDate";
import {getAssetIdMap} from "./tradeHistory/getAssetIdMap";
import {getTradeItems} from "./tradeHistory/getTradeItems";
import {getTradeCheck} from "../../services/VSkinBackend/tradeCheck/getTradeCheck";

export const checkTrade = async ({tradeRow}: {tradeRow: HTMLElement}) => {
    const initiatorSteamId = getLoggedInSteamId();
    if (!initiatorSteamId) return;
    const counterpartySteamId = getCounterpartySteamId({tradeRow});
    if (!counterpartySteamId) return;
    const tradeDate = getTradeDate({tradeRow});
    if (!tradeDate) return;
    const assetIdMap = getAssetIdMap();
    const {sentItems, receivedItems} = getTradeItems({tradeRow, assetIdMap});
    return await getTradeCheck({body: {
        initiatorSteamId,
        counterpartySteamId,
        tradeDate,
        sentItems,
        receivedItems,
    }});
};
