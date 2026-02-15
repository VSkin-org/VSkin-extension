import {getStorageItem} from "./getStorageItem";
import {startButtonCooldown} from "./startButtonCooldown";
import {STORAGE_KEYS} from "../contantes";

export const resumeButtonCooldown = async ({button}: {button: HTMLButtonElement}) => {
    const endTime = await getStorageItem<number>({key: STORAGE_KEYS.SCAN_COOLDOWN_END});
    if (!endTime) return;

    const remaining = Math.ceil((endTime - Date.now()) / 1000);
    if (remaining <= 0) return;

    startButtonCooldown({button, seconds: remaining});
};
