import type { WalletBehavior } from "./WalletBehaviorInterface";
import { StarknetWalletSVG } from "../images/starknetWallet";
import type { ChainId, RequestFn, RequestFnCall, RpcMessage, WalletEvents, NetworkChangeEventHandler, AccountChangeEventHandler, RpcTypeToMessageMap, ApiVersionRequest, Address, RequestAccountsParameters } from "@starknet-io/types-js";
import { constants } from "starknet";
import type { RequestParams } from "../types";
import { BaseApiVersion as DefaultApiVersion } from "../const";

const userEventHandlers: WalletEvents[] = []

export const FullCompatibleSimulator: WalletBehavior = {
  id: "SimulatorWallet",
  name: "Simulator of Starknet wallet",
  version: "1.0.0",
  icon: StarknetWalletSVG,
  requestChainId: async (params: RequestParams): Promise<ChainId> => {
    const param = params.params as ApiVersionRequest | undefined;
    const context = params.context;
    const apiVersion: string = param !== undefined ? param.api_version ?? DefaultApiVersion : DefaultApiVersion;
    switch (apiVersion) {
      case "0.7":
        return constants.StarknetChainId[context.currentNetwork];
      default:
        throw new Error("ApiVersion not supported");
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
        throw new Error("ApiVersion not supported");
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