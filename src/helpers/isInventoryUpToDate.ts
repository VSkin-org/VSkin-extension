export const isInventoryUpToDate = ({currentHashes, cachedHashes}: {
    currentHashes: [string, string];
    cachedHashes: [string | null, string | null];
}): boolean => {
    const [itemsHash, protectedItemsHash] = currentHashes;
    const [cachedItemsHash, cachedProtectedItemsHash] = cachedHashes;
    return itemsHash === cachedItemsHash && protectedItemsHash === cachedProtectedItemsHash;
};
