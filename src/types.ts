import type { Account, constants, RpcProvider } from "starknet"

export type RequestParams = {
    params: any,
    context: {
        currentNetwork: constants.NetworkName
        accountMainnet: Account,
        accountTestnet: Account,
        mainnetProvider: RpcProvider,
        testnetProvider: RpcProvider,
    }
}
