import {runInventorySync} from "../helpers/runInventorySync";

chrome.runtime.onMessageExternal.addListener((message, _sender, sendResponse) => {
    if (message?.type !== "INVENTORY_SYNC") return undefined;

    runInventorySync()
        .then((result) => sendResponse(result))
        .catch((error) =>
            sendResponse({
                status: "BACKEND_ERROR",
                message: error instanceof Error ? error.message : "Unknown error",
            }),
        );

    return true;
});
