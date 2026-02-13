import {VSKIN_LOGO_SVG} from "../../assets/img/logo";
import {scanInventory} from "../../helpers/steam/scanInventory";

const STYLES = `
    #inventory_logos {
        display: flex;
        align-items: center;
    }
    #vskin-container {
        display: flex;
        flex-direction: column;
        align-items: end;
        gap: 12px;
        margin-left: auto;
    }
    #vskin-scan-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: linear-gradient(135deg, #1D4ED8, #2563EB);
        border: 1px solid rgba(56, 189, 248, 0.3);
        border-radius: 3px;
        color: #ffffff;
        font-size: 13px;
        font-weight: 500;
        font-family: "Motiva Sans", Arial, sans-serif;
        cursor: pointer;
        transition: all 0.2s ease;
        line-height: 1;
    }
    #vskin-scan-btn:hover {
        background: linear-gradient(135deg, #2563EB, #38BDF8);
        border-color: rgba(56, 189, 248, 0.6);
    }
    #vskin-scan-btn:active {
        opacity: 0.8;
    }
    #vskin-scan-btn svg {
        flex-shrink: 0;
    }
    #vskin-message {
        color: #8f98a0;
        font-size: 13px;
        font-family: "Motiva Sans", Arial, sans-serif;
        min-height: 1.2em;
        line-height: 1.2;
    }
`;

export const createVskinButton = (): HTMLDivElement => {
    const container = document.createElement("div");
    container.id = "vskin-container";

    const style = document.createElement("style");
    style.textContent = STYLES;

    const button = document.createElement("button");
    button.id = "vskin-scan-btn";
    button.innerHTML = `${VSKIN_LOGO_SVG}<span>Scan With VSkin</span>`;
    button.addEventListener("click", async () => {
        const response = await scanInventory();
        message.textContent = response?.message ?? "";
    });

    const message = document.createElement("span");
    message.id = "vskin-message";

    container.appendChild(style);
    container.appendChild(button);
    container.appendChild(message);

    return container;
};
