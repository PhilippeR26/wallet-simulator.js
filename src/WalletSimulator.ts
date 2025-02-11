import type { RequestFn, WALLET_API, WalletEventListener, RpcMessage, RequestFnCall, RpcTypeToMessageMap, ApiVersionRequest, ChainId } from "@starknet-io/types-js";
import type { Account, RpcProvider } from "starknet";
import  {  constants } from "starknet";
import type { WalletBehavior } from "./WalletBehavior";
import type { RequestParams, UserBehaviorState } from "./types";

export class WalletSimulator implements WALLET_API.StarknetWindowObject {
    readonly id: string;

    readonly name: string;

    readonly version: string;

    readonly icon: string | {
        dark: string;
        light: string;
    };

    public request: RequestFn;

    public on: WalletEventListener;

    public off: WalletEventListener;

    readonly user:UserBehaviorState ;

    private mainnetProvider: RpcProvider;

    private testnetProvider: RpcProvider;

    private accountMainnet: Account;

    private accountTestnet: Account;

    private walletBehavior: WalletBehavior;

    readonly currentNetwork: constants.NetworkName;

    constructor(
        mainnetProvider: RpcProvider,
        testnetProvider: RpcProvider,
        accountMainnet: Account,
        accountTestnet: Account,
        walletDefinition: WalletBehavior
    ) {
        this.mainnetProvider = mainnetProvider;
        this.testnetProvider = testnetProvider;
        this.accountMainnet = accountMainnet;
        this.accountTestnet = accountTestnet;
        this.walletBehavior = walletDefinition;
        this.id = walletDefinition.id;
        this.name = walletDefinition.name;
        this.version = walletDefinition.version;
        this.icon = walletDefinition.icon;
        this.request = async function requestMessageHandler<T extends RpcMessage["type"]>(
            call: RequestFnCall<T>,
        ): Promise<RpcTypeToMessageMap[T]["result"]> {
            const handlerMap: Record<RpcMessage["type"], (params?: any) => Promise<any>> =
            {
                wallet_addStarknetChain: async (params?: ApiVersionRequest): Promise<ChainId> => {
                    return "0x1234"
                },
                wallet_switchStarknetChain: async (params?: ApiVersionRequest): Promise<ChainId> => {
                    return "0x1234"
                },
                wallet_watchAsset: async (params?: ApiVersionRequest): Promise<ChainId> => {
                    return "0x1234"
                },
                wallet_requestAccounts: walletDefinition.requestAccount,
                wallet_getPermissions: async (params?: ApiVersionRequest): Promise<ChainId> => {
                    return "0x1234"
                },
                wallet_requestChainId: walletDefinition.requestChainId,
                wallet_deploymentData: async (params?: ApiVersionRequest): Promise<ChainId> => {
                    return "0x1234"
                },
                wallet_addDeclareTransaction: async (params?: ApiVersionRequest): Promise<ChainId> => {
                    return "0x1234"
                },
                wallet_addInvokeTransaction: walletDefinition.addInvokeTransaction,
                wallet_signTypedData: async (params?: ApiVersionRequest): Promise<ChainId> => {
                    return "0x1234"
                },
                wallet_supportedSpecs: async (params?: ApiVersionRequest): Promise<ChainId> => {
                    return "0x1234"
                },
                wallet_supportedWalletApi: async () => {
                    // not implemented
                    throw new Error("Not implemented")
                },
            }

            const handler = handlerMap[call.type]
            if (handler) {
                const parameters: RequestParams = { params: call.params, context: { 
                    currentNetwork: this.currentNetwork ,
                    accountMainnet: this.accountMainnet,
                    accountTestnet: this.accountTestnet,
                    mainnetProvider: this.mainnetProvider,
                    testnetProvider: this.testnetProvider,
                    userContext:this.user
                } };
                // console.log(parameters);
                return handler(parameters)
            }

            throw new Error(`Unknown request type: ${call.type}`)
        };
        this.on = walletDefinition.on;
        this.off = walletDefinition.off;
        this.currentNetwork = constants.NetworkName.SN_SEPOLIA;
        this.user=walletDefinition.userState;
    }

    userBehavior() { }

};
