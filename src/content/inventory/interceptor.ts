const INVENTORY_URL_REGEX = /\/inventory\/\d+\/730\/(2|16)\b/;

const originalFetch = window.fetch;
window.fetch = async function (...args: Parameters<typeof fetch>) {
    const response = await originalFetch.apply(this, args);
    const url = typeof args[0] === "string" ? args[0] : args[0] instanceof Request ? args[0].url : "";
    const match = url.match(INVENTORY_URL_REGEX);

    if (match) {
        const clone = response.clone();
        clone.json().then((data) => {
            window.postMessage({
                type: "VSKIN_INVENTORY_INTERCEPTED",
                contextId: match[1],
                data,
            }, "*");
        }).catch(() => {});
    }

    return response;
};

const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method: string, url: string | URL, ...rest: any[]) {
    (this as any)._vskinUrl = typeof url === "string" ? url : url.toString();
    return originalOpen.apply(this, [method, url, ...rest] as any);
};

const originalSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function (...args: Parameters<typeof XMLHttpRequest.prototype.send>) {
    const match = (this as any)._vskinUrl?.match(INVENTORY_URL_REGEX);

    if (match) {
        this.addEventListener("load", () => {
            try {
                const data = JSON.parse(this.responseText);
                window.postMessage({
                    type: "VSKIN_INVENTORY_INTERCEPTED",
                    contextId: match[1],
                    data,
                }, "*");
            } catch {}
        });
    }

    return originalSend.apply(this, args);
};
