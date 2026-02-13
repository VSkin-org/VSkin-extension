import {post} from "../../index";
import {RequestInterfaceBody, ResponseInterface} from "./types";

export const getTradeCheck = ({body}: {body: RequestInterfaceBody}) => {
    return post<ResponseInterface>({
        url: "https://vskin-back-production.up.railway.app/api/v1/public/extension/trade/check",
        body,
    });
};
