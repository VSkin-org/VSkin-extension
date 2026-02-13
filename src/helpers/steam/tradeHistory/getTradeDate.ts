const MONTHS: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

const parseTimestamp = ({raw}: {raw: string}): {hours: number; minutes: number} => {
    const match = raw.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
    if (!match) return {hours: 0, minutes: 0};

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toLowerCase();

    if (period === "pm" && hours !== 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;

    return {hours, minutes};
};

export const getTradeDate = ({tradeRow}: {tradeRow: HTMLElement}): string | null => {
    const dateEl = tradeRow.querySelector(".tradehistory_date");
    if (!dateEl) return null;

    const timestampEl = dateEl.querySelector(".tradehistory_timestamp");
    const timestamp = timestampEl?.textContent?.trim() ?? "";

    const dateText = dateEl.firstChild?.textContent?.trim() ?? "";

    const dateMatch = dateText.match(/^(\d{1,2})\s+(\w{3}),?\s+(\d{4})$/);
    if (!dateMatch) return null;

    const day = parseInt(dateMatch[1], 10);
    const month = MONTHS[dateMatch[2]];
    const year = parseInt(dateMatch[3], 10);

    if (month === undefined) return null;

    const {hours, minutes} = parseTimestamp({raw: timestamp});

    const date = new Date(year, month, day, hours, minutes);
    return date.toISOString();
};
