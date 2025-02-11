import type { Account, constants, RpcProvider } from "starknet"

export type UserBehaviorState = {
    txVersion: 1 | 3,
    walletLocked: boolean,
    acceptRequests: boolean,
    acceptConnection: boolean,
    acceptUnlock: boolean,
}

export type RequestParams = {
    params: any,
    context: {
        currentNetwork: constants.NetworkName
        accountMainnet: Account,
        accountTestnet: Account,
        mainnetProvider: RpcProvider,
        testnetProvider: RpcProvider,
        userContext:UserBehaviorState,
    }
}
