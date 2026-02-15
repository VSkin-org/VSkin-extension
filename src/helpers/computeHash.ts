export const computeHash = async ({data}: {data: unknown}): Promise<string> => {
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const buffer = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
};
