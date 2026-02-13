export const getTradeItems = ({tradeRow, assetIdMap}: {
    tradeRow: HTMLElement;
    assetIdMap: Record<string, string>;
}): {sentItems: Array<string>; receivedItems: Array<string>} => {
    const sentItems: Array<string> = [];
    const receivedItems: Array<string> = [];

    const items = tradeRow.querySelectorAll(".history_item[id]");

    items.forEach((item) => {
        const domId = item.id;
        const assetId = assetIdMap[domId];
        if (!assetId) return;

        if (domId.includes("_givenitem")) {
            sentItems.push(assetId);
        } else if (domId.includes("_receiveditem")) {
            receivedItems.push(assetId);
        }
    });

    return {sentItems, receivedItems};
};
