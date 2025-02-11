import type { WalletBehavior } from "./WalletBehaviorInterface";
import { StarknetWalletSVG } from "../images/starknetWallet";
import type { ChainId, RequestFn, RequestFnCall, RpcMessage, WalletEvents, NetworkChangeEventHandler, AccountChangeEventHandler, RpcTypeToMessageMap, ApiVersionRequest, Address, RequestAccountsParameters, AddInvokeTransactionResult, AddInvokeTransactionParameters, WALLET_API, Call as ApiCall } from "@starknet-io/types-js";
import { constants, type Account, type Call } from "starknet";
import type { RequestParams } from "../types";
import { BaseApiVersion as DefaultApiVersion } from "../const";
import { API_VERSION_NOT_SUPPORTED, ApiError, INVALID_REQUEST_PAYLOAD } from "./errors";
import type { } from "@starknet-io/types-js/dist/types/wallet-api";

const userEventHandlers: WalletEvents[] = []

export const FullCompatibleSimulator: WalletBehavior = {
  id: "SimulatorWallet",
  name: "Simulator of Starknet wallet",
  version: "1.0.0",
  icon: StarknetWalletSVG,
  userState: {
    txVersion: 3,
    walletLocked: true,
    acceptRequests: true,
    acceptConnection: true,
    acceptUnlock: true,
  },
  requestChainId: async (params: RequestParams): Promise<ChainId> => {
    const param = params.params as ApiVersionRequest | undefined;
    const context = params.context;
    const apiVersion: string = param !== undefined ? param.api_version ?? DefaultApiVersion : DefaultApiVersion;
    switch (apiVersion) {
      case "0.7":
        return constants.StarknetChainId[context.currentNetwork];
      default:
        throw new ApiError(API_VERSION_NOT_SUPPORTED);
    }
  },
  requestAccount: async (params: RequestParams): Promise<Address[]> => {
    const param = params.params as (RequestAccountsParameters & ApiVersionRequest) | undefined;
    const context = params.context;
    const apiVersion: string = param !== undefined ? param.api_version ?? DefaultApiVersion : DefaultApiVersion;
    switch (apiVersion) {
      case "0.7":
        const addr: string = context.currentNetwork == constants.NetworkName.SN_MAIN ? context.accountMainnet.address : context.accountTestnet.address;
        return [addr];
      default:
        throw new ApiError(API_VERSION_NOT_SUPPORTED);
    }
  },
  addInvokeTransaction: async (params: RequestParams): Promise<AddInvokeTransactionResult> => {
    const param = params.params as (AddInvokeTransactionParameters & ApiVersionRequest);
    const context = params.context;
    const apiVersion: string = param !== undefined ? param.api_version ?? DefaultApiVersion : DefaultApiVersion;
    switch (apiVersion) {
      case "0.7":
        const calls = param.calls;
        try {
          const myAccount: Account = context.currentNetwork == constants.NetworkName.SN_MAIN ? context.accountMainnet : context.accountTestnet;
          const convertedCalls = calls.map((apiCall: ApiCall): Call => { return { contractAddress: apiCall.contract_address, entrypoint: apiCall.entry_point, calldata: apiCall.calldata } });
          const resp=await myAccount.execute(convertedCalls, { version: context.userContext.txVersion });
          return resp;
          break;
        } catch(err:any) {
          console.log(err);
          throw new ApiError(INVALID_REQUEST_PAYLOAD);
        }
        
      default:
        throw new ApiError(API_VERSION_NOT_SUPPORTED);

    }
  },
  on: (event, handleEvent) => {
    if (event === "accountsChanged") {
      userEventHandlers.push({
        type: event,
        handler: handleEvent as AccountChangeEventHandler,
      })
    } else if (event === "networkChanged") {
      userEventHandlers.push({
        type: event,
        handler: handleEvent as NetworkChangeEventHandler,
      })
    } else {
      throw new Error(`Unknown event: ${event}`)
    }
  },

  off: (event, handleEvent) => {
    if (event !== "accountsChanged" && event !== "networkChanged") {
      throw new Error(`Unknwown event: ${event}`)
    }

    const eventIndex = userEventHandlers.findIndex(
      (userEvent) =>
        userEvent.type === event && userEvent.handler === handleEvent,
    )

    if (eventIndex >= 0) {
      userEventHandlers.splice(eventIndex, 1)
    }
  },
};