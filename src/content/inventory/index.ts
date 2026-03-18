import {createVskinButton} from "./vskinButton";
import {isOwnInventory} from "../../helpers/steam/inventory/isOwnInventory";
import {initInterceptorBridge} from "../../helpers/steam/inventory/initInterceptorBridge";

const init = () => {
    if (!isOwnInventory()) return;

    initInterceptorBridge();

    const inventoryLogos = document.querySelector("#inventory_logos");
    if (!inventoryLogos) return;

    inventoryLogos.append(createVskinButton());
};

init();
