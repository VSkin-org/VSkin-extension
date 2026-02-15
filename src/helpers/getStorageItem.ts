export const getStorageItem = async <T>({key}: {key: string}): Promise<T | null> => {
    const result = await chrome.storage.local.get(key);
    return (result[key] as T) ?? null;
};
