import type { RequestFn, WalletEventListener, ApiVersionRequest, RequestAccountsParameters, AddInvokeTransactionResult } from "@starknet-io/types-js";
import type { RpcProvider } from "starknet";
import type { RequestParams, UserBehaviorState } from "../types";
import type { ChainId,Address } from "@starknet-io/types-js";
import type {  } from "@starknet-io/types-js/dist/types/wallet-api";

export type WalletBehavior = {
    id: string;
    name: string;
    version: string;
    icon: string | {
        dark: string;
        light: string;
    };
    userState: UserBehaviorState;
    requestChainId: (params: RequestParams) => Promise<ChainId>,
    requestAccount: (params:  RequestParams) => Promise<Address[]>,
    addInvokeTransaction:(params:  RequestParams) => Promise<AddInvokeTransactionResult>,
    on: WalletEventListener;
    off: WalletEventListener;
};