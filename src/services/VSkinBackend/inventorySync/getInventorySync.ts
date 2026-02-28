import {post} from "../../index";
import {RequestInterfaceBody, ResponseInterface} from "./types";

export const getInventorySync = ({body}: {body: RequestInterfaceBody}) => {
    return post<ResponseInterface>({
        url: "https://api.vskin.gg/api/v1/public/extension/inventory/sync",
        body,
    });
};
