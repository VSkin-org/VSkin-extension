const ALLOWED_ORIGINS = [
    "https://api.vskin.gg",
    "https://staging.api.vskin.gg",
    "http://localhost:5001",
];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.id !== chrome.runtime.id) return;

    if (message.type === "POST") {
        const isAllowed = ALLOWED_ORIGINS.some((origin) => message.url?.startsWith(origin));
        if (!isAllowed) {
            sendResponse({success: false, message: "URL not allowed"});
            return true;
        }

        fetch(message.url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(message.body),
        })
            .then((response) => response.json())
            .then((data) => sendResponse(data))
            .catch(() => sendResponse({success: false, message: "Request failed"}));
        return true;
    }
});
