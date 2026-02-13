export const getAssetIdMap = (): Record<string, string> => {
    const map: Record<string, string> = {};
    const scripts = document.querySelectorAll("script");

    scripts.forEach((script) => {
        const text = script.textContent ?? "";
        const regex = /HistoryPageCreateItemHover\(\s*'([^']+)',\s*\d+,\s*'[^']*',\s*'(\d+)'/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
            map[match[1]] = match[2];
        }
    });

    return map;
};
