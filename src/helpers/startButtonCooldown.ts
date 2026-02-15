import {setStorageItem} from "./setStorageItem";
import {STORAGE_KEYS} from "../contantes";

export const startButtonCooldown = ({button, seconds}: {button: HTMLButtonElement; seconds: number}) => {
    const label = button.querySelector("span");
    if (!label) return;

    const originalText = label.textContent;
    const endTime = Date.now() + seconds * 1000;
    button.disabled = true;
    let remaining = seconds;

    setStorageItem({key: STORAGE_KEYS.SCAN_COOLDOWN_END, value: endTime});
    label.textContent = `Next scan in ${remaining}s`;

    const interval = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
            clearInterval(interval);
            label.textContent = originalText;
            button.disabled = false;
            setStorageItem({key: STORAGE_KEYS.SCAN_COOLDOWN_END, value: 0});
            return;
        }
        label.textContent = `Next scan in ${remaining}s`;
    }, 1000);
};
