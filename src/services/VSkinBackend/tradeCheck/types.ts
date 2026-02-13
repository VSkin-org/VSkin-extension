export type RequestInterfaceBody = {
    initiatorSteamId: string;
    counterpartySteamId: string;
    tradeDate: string;
    sentItems: Array<string>;
    receivedItems: Array<string>;
};

export type ResponseInterface = {
    message?: string;
};