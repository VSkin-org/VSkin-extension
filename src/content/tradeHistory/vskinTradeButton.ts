import {VSKIN_LOGO_SVG} from "../../assets/img/logo";
import {checkTrade} from "../../helpers/steam/checkTrade";

const STYLES = `
    .vskin-trade-container {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 8px;
    }
    .vskin-trade-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background: linear-gradient(135deg, #1D4ED8, #2563EB);
        border: 1px solid rgba(56, 189, 248, 0.3);
        border-radius: 3px;
        color: #ffffff;
        font-size: 12px;
        font-weight: 500;
        font-family: "Motiva Sans", Arial, sans-serif;
        cursor: pointer;
        transition: all 0.2s ease;
        line-height: 1;
        white-space: nowrap;
    }
    .vskin-trade-btn:hover {
        background: linear-gradient(135deg, #2563EB, #38BDF8);
        border-color: rgba(56, 189, 248, 0.6);
    }
    .vskin-trade-btn:active {
        opacity: 0.8;
    }
    .vskin-trade-btn svg {
        flex-shrink: 0;
    }
    .vskin-trade-message {
        color: #8f98a0;
        font-size: 12px;
        font-family: "Motiva Sans", Arial, sans-serif;
        min-height: 1.2em;
        line-height: 1.2;
    }
`;

let stylesInjected = false;

const injectStyles = () => {
    if (stylesInjected) return;
    const style = document.createElement("style");
    style.textContent = STYLES;
    document.head.appendChild(style);
    stylesInjected = true;
};

export const createVskinTradeButton = ({tradeRow}: {tradeRow: HTMLElement}): HTMLDivElement => {
    injectStyles();

    const container = document.createElement("div");
    container.classList.add("vskin-trade-container");

    const button = document.createElement("button");
    button.classList.add("vskin-trade-btn");
    button.innerHTML = `${VSKIN_LOGO_SVG}<span>Confirm Trade with VSkin</span>`;

    const message = document.createElement("span");
    message.classList.add("vskin-trade-message");

    button.addEventListener("click", async () => {
        const response = await checkTrade({tradeRow});
        message.textContent = response?.message ?? "";
    });

    container.appendChild(button);
    container.appendChild(message);

    return container;
};
