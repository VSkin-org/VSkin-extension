import {createVskinTradeButton} from "./vskinTradeButton";

const init = () => {
    const tradeRows = document.querySelectorAll<HTMLElement>(".tradehistoryrow");

    tradeRows.forEach((tradeRow) => {
        const content = tradeRow.querySelector(".tradehistory_content");
        if (!content) return;

        content.appendChild(createVskinTradeButton({tradeRow}));
    });
};

init();
