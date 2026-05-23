import {VSKIN_LOGO_SVG} from "../assets/img/logo";
import {getSteamLoginCookie} from "../helpers/steam/inventory/getSteamLoginCookie";
import {extractSteamIdFromCookie} from "../helpers/steam/inventory/extractSteamIdFromCookie";
import {runInventorySync, RunInventorySyncResult} from "../helpers/runInventorySync";
import {startButtonCooldown} from "../helpers/startButtonCooldown";
import {resumeButtonCooldown} from "../helpers/resumeButtonCooldown";
import {SCAN_COOLDOWN_SECONDS} from "../contantes";

const root = document.getElementById("popup-root")!;

const card = document.createElement("div");
card.className = "popup-card";

const container = document.createElement("div");
container.className = "popup-container";

const logoWrapper = document.createElement("div");
logoWrapper.className = "popup-logo-wrapper";

const logoEl = document.createElement("div");
logoEl.className = "popup-logo";
logoEl.innerHTML = VSKIN_LOGO_SVG;
logoWrapper.appendChild(logoEl);

const statusEl = document.createElement("div");
statusEl.className = "popup-status";
statusEl.textContent = "Checking...";

const divider = document.createElement("div");
divider.className = "popup-divider";

const messageBox = document.createElement("div");
messageBox.className = "popup-message-box";
messageBox.style.display = "none";

const messageEl = document.createElement("div");
messageEl.className = "popup-message";
messageBox.appendChild(messageEl);

const syncBtn = document.createElement("button");
syncBtn.className = "popup-btn popup-btn-primary";
syncBtn.textContent = "Sync Inventory";

container.appendChild(logoWrapper);
container.appendChild(statusEl);
card.appendChild(container);
root.appendChild(card);

const formatErrorMessage = (result: Exclude<RunInventorySyncResult, {status: "OK"}>): string => {
    switch (result.status) {
        case "COOLDOWN":
            return `Please wait ${result.secondsLeft}s before syncing again`;
        case "NO_SESSION":
            return "Not connected to Steam";
        case "BACKEND_ERROR":
            return result.message;
    }
};

const renderConnected = () => {
    statusEl.innerHTML = `<span class="popup-dot"></span> Connected to Steam`;
    statusEl.className = "popup-status connected";

    syncBtn.addEventListener("click", async () => {
        syncBtn.disabled = true;
        syncBtn.textContent = "Syncing...";
        messageBox.style.display = "none";
        messageEl.textContent = "";
        messageEl.className = "popup-message";

        const result = await runInventorySync();

        if (result.status === "OK") {
            messageEl.textContent = result.message || "Sync in progress";
            messageEl.className = "popup-message";
            messageBox.style.display = "";
            startButtonCooldown({button: syncBtn, seconds: SCAN_COOLDOWN_SECONDS});
        } else {
            messageEl.textContent = formatErrorMessage(result);
            messageEl.className = "popup-message error";
            messageBox.style.display = "";
            syncBtn.disabled = false;
            syncBtn.textContent = "Sync Inventory";
        }
    });

    container.appendChild(divider);
    container.appendChild(syncBtn);
    container.appendChild(messageBox);

    resumeButtonCooldown({button: syncBtn});
};

const renderDisconnected = () => {
    statusEl.textContent = "Not connected to Steam";
    statusEl.className = "popup-status disconnected";

    const loginBtn = document.createElement("button");
    loginBtn.className = "popup-btn popup-btn-secondary";
    loginBtn.textContent = "Log in to Steam";

    loginBtn.addEventListener("click", () => {
        chrome.tabs.create({url: "https://steamcommunity.com/login/home/"});
    });

    container.appendChild(divider);
    container.appendChild(loginBtn);
};

const init = async () => {
    const cookie = await getSteamLoginCookie();

    if (!cookie) {
        renderDisconnected();
        return;
    }

    const steamId = extractSteamIdFromCookie({cookieValue: cookie.value});

    if (!steamId) {
        renderDisconnected();
        return;
    }

    renderConnected();
};

init();
