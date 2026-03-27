import {VSKIN_LOGO_SVG} from "../assets/img/logo";
import {getSteamLoginCookie} from "../helpers/steam/inventory/getSteamLoginCookie";
import {extractSteamIdFromCookie} from "../helpers/steam/inventory/extractSteamIdFromCookie";
import {getSteamInventory} from "../services/Steam/getSteamInventory";
import {getInventorySync} from "../services/VSkinBackend/inventorySync/getInventorySync";
import {startButtonCooldown} from "../helpers/startButtonCooldown";
import {resumeButtonCooldown} from "../helpers/resumeButtonCooldown";
import {STEAM_CONTEXT_ID, SCAN_COOLDOWN_SECONDS} from "../contantes";
import {SteamInventoryResponseInterface} from "../services/Steam/types";

const EMPTY_INVENTORY: SteamInventoryResponseInterface = {
    assets: [],
    descriptions: [],
    total_inventory_count: 0,
    success: true,
    rwgrsn: -1,
};

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

const renderConnected = ({steamId}: {steamId: string}) => {
    statusEl.innerHTML = `<span class="popup-dot"></span> Connected to Steam`;
    statusEl.className = "popup-status connected";

    syncBtn.addEventListener("click", async () => {
        syncBtn.disabled = true;
        syncBtn.textContent = "Syncing...";
        messageBox.style.display = "none";
        messageEl.textContent = "";
        messageEl.className = "popup-message";

        try {
            const [items, protectedItems] = await Promise.all([
                getSteamInventory({query: {steamId, contextId: STEAM_CONTEXT_ID.INVENTORY_UNPROTECTED}}),
                getSteamInventory({query: {steamId, contextId: STEAM_CONTEXT_ID.INVENTORY_PROTECTED}})
                    .catch(() => EMPTY_INVENTORY),
            ]);

            const response = await getInventorySync({body: {steamId, items, protectedItems}});
            messageEl.textContent = response.message || "Sync in progress";
            messageEl.className = "popup-message";
            messageBox.style.display = "";
            startButtonCooldown({button: syncBtn, seconds: SCAN_COOLDOWN_SECONDS});
        } catch (error) {
            messageEl.textContent = error instanceof Error ? error.message : "Sync failed";
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

    renderConnected({steamId});
};

init();
