import {SteamInventoryResponseInterface} from "../../Steam/types";

export type RequestInterfaceBody = {
    steamId: string;
    items: SteamInventoryResponseInterface;
    protectedItems: SteamInventoryResponseInterface;
};

export type ResponseInterface = {
    message?: string;
};