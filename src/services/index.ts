export const get = async <T>({url}: {url: string}): Promise<T> => {
    const response = await fetch(url);
    return response.json();
};

export const post = async <T>({url, body}: {url: string; body: unknown}): Promise<T> => {
    return chrome.runtime.sendMessage({type: "POST", url, body});
};
