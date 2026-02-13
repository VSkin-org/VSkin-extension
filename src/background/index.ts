chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "POST") {
        fetch(message.url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(message.body),
        })
            .then((response) => response.json())
            .then((data) => sendResponse(data))
            .catch((error) => sendResponse({success: false, message: error.message}));
        return true;
    }
});
