export const setStorageItem = <T>({key, value}: {key: string; value: T}) => {
    return chrome.storage.local.set({[key]: value});
};
