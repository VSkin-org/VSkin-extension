import {setStorageItem} from "./setStorageItem";
import {STORAGE_KEYS} from "../contantes";

export const startButtonCooldown = ({button, seconds}: {button: HTMLButtonElement; seconds: number}) => {
    const originalText = button.textContent;
    const endTime = Date.now() + seconds * 1000;
    button.disabled = true;
    let remaining = seconds;

    setStorageItem({key: STORAGE_KEYS.SCAN_COOLDOWN_END, value: endTime});
    button.textContent = `Next scan in ${remaining}s`;

    const interval = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
            clearInterval(interval);
            button.textContent = originalText;
            button.disabled = false;
            setStorageItem({key: STORAGE_KEYS.SCAN_COOLDOWN_END, value: 0});
            return;
        }
        button.textContent = `Next scan in ${remaining}s`;
    }, 1000);
};
