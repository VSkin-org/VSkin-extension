import {createVskinButton} from "./vskinButton";
import {isOwnInventory} from "../../helpers/steam/inventory/isOwnInventory";

const init = () => {
    if (!isOwnInventory()) return;

    const inventoryLogos = document.querySelector("#inventory_logos");
    if (!inventoryLogos) return;

    inventoryLogos.append(createVskinButton());
};

init();
