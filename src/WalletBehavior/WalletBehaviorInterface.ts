import type { RequestFn, WalletEventListener, ApiVersionRequest, RequestAccountsParameters } from "@starknet-io/types-js";
import type { RpcProvider } from "starknet";
import type { RequestParams } from "../types";
import type { ChainId,Address } from "@starknet-io/types-js";

export type WalletBehavior = {
    id: string;
    name: string;
    version: string;
    icon: string | {
        dark: string;
        light: string;
    };
    requestChainId: (params: RequestParams) => Promise<ChainId>,
    requestAccount: (params:  RequestParams) => Promise<Address[]>,
    on: WalletEventListener;
    off: WalletEventListener;
};