import {VSKIN_LOGO_SVG} from "../../assets/img/logo";
import {resumeButtonCooldown} from "../../helpers/resumeButtonCooldown";
import {startButtonCooldown} from "../../helpers/startButtonCooldown";
import {scanInventory} from "../../helpers/steam/scanInventory";
import {SCAN_COOLDOWN_SECONDS} from "../../contantes";

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
        padding: 0px 15px;
        background: linear-gradient( to bottom, rgba(47,137,188,1) 5%, rgba(23,67,92,1) 95%);
        border: none;
        border-radius: 2px;
        color: #A4D7F5;
        font-size: 15px;
        font-weight: 400;
        font-family: "Motiva Sans", Arial, Helvetica, sans-serif;
        cursor: pointer;
        line-height: 30px;
    }
    #vskin-scan-btn span {
        width: 125px;
        text-align: left;
    }
    #vskin-scan-btn:hover {
        background: #54a5d4;
        color: #fff;
    }
    #vskin-scan-btn:disabled {
        background: linear-gradient(135deg, #374151, #4B5563);
        border-color: rgba(107, 114, 128, 0.3);
        cursor: not-allowed;
        opacity: 0.7;
    }
    #vskin-scan-btn svg {
        flex-shrink: 0;
        width: 16px;
        height: 16px;
    }
    #vskin-message {
        color: #8f98a0;
        font-size: 13px;
        font-family: "Motiva Sans", Arial, Helvetica, sans-serif;
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
    resumeButtonCooldown({button});
    button.addEventListener("click", async () => {
        startButtonCooldown({button, seconds: SCAN_COOLDOWN_SECONDS});
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
