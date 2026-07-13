import {SteamInventoryResponseInterface} from "../../Steam/types";

export type RequestInterfaceBody = {
    steamId: string;
    inventory: SteamInventoryResponseInterface;
};

export type ResponseInterface = {
    message?: string;
};