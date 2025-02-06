// Test Starknet.js WalletAccount class in node.js, using a fully compatible wallet.
// Launch with npx ts-node demo/simulateWallet.ts
// Coded with Starknet.js v6.23.0

import { Account, RpcProvider, shortString, WalletAccount } from "starknet";
import { DEVNET_MAINNET_PORT, DEVNET_TESTNET_PORT, DEVNET_VERSION } from "./utils/constants";
import { Devnet } from "starknet-devnet";
import fs from "fs";
import cp from "child_process";
import events from "events";
import kill from "cross-port-killer";
import { FullCompatibleSimulator, WalletSimulator, type WalletBehavior } from "../src";
import type { WALLET_API } from "@starknet-io/types-js";

async function main() {
    // **** launch devnet-rs Testnet with a new console window
    const outputStreamTestnet = fs.createWriteStream("./demo/devnet-testnet-out.txt");
    await events.once(outputStreamTestnet, "open");
    // the following line is working in Linux. To adapt or remove for other OS
    cp.spawn("gnome-terminal", ["--", "bash", "-c", "pwd; tail -f ./demo/devnet-testnet-out.txt; read"]);
    const devnetTestnet = await Devnet.spawnVersion(DEVNET_VERSION, {
        stdout: outputStreamTestnet,
        stderr: outputStreamTestnet,
        keepAlive: false,
        args: [
            "--seed", "0",
            "--port", DEVNET_TESTNET_PORT,
            "--fork-network", "https://free-rpc.nethermind.io/sepolia-juno/v0_7"
        ],

    });
    const myProviderDevnetTestnet = new RpcProvider({ nodeUrl: devnetTestnet.provider.url });
    console.log("devnet-rs Testnet : url =", devnetTestnet.provider.url);
    console.log("chain Id Testnet =", shortString.decodeShortString(await myProviderDevnetTestnet.getChainId()), ", rpc", await myProviderDevnetTestnet.getSpecVersion());
    console.log("Provider connected to Starknet-devnet-rs Testnet");

    // **** launch devnet-rs Mainnet with a new console window
    const outputStreamMainnet = fs.createWriteStream("./demo/devnet-mainnet-out.txt");
    await events.once(outputStreamMainnet, "open");
    // the following line is working in Linux. To adapt or remove for other OS
    cp.spawn("gnome-terminal", ["--", "bash", "-c", "pwd; tail -f ./demo/devnet-mainnet-out.txt; read"]);
    const devnetMainnet = await Devnet.spawnVersion(DEVNET_VERSION, {
        stdout: outputStreamMainnet,
        stderr: outputStreamMainnet,
        keepAlive: false,
        args: [
            "--seed", "0",
            "--port", DEVNET_MAINNET_PORT,
            "--fork-network", "https://free-rpc.nethermind.io/mainnet-juno/v0_7"
        ],

    });
    const myProviderDevnetMainnet = new RpcProvider({ nodeUrl: devnetMainnet.provider.url });
    console.log("devnet-rs Mainnet : url =", devnetMainnet.provider.url);
    console.log("chain Id Mainnet =", shortString.decodeShortString(await myProviderDevnetMainnet.getChainId()), ", rpc", await myProviderDevnetMainnet.getSpecVersion());
    console.log("Provider connected to Starknet-devnet-rs Mainnet");

    // initialize existing predeployed account 0 of Devnet
    const devnetTestnetAccounts = await devnetTestnet.provider.getPredeployedAccounts();
    const account0Testnet = new Account(myProviderDevnetTestnet, devnetTestnetAccounts[0].address, devnetTestnetAccounts[0].private_key);
    console.log("Account 0 Testnet connected.\nAddress =", account0Testnet.address, "\n");
    const devnetMainnetAccounts = await devnetMainnet.provider.getPredeployedAccounts();
    const account1Mainnet = new Account(myProviderDevnetMainnet, devnetMainnetAccounts[1].address, devnetMainnetAccounts[1].private_key);
    console.log("Account 1 Mainnet connected.\nAddress =", account1Mainnet.address, "\n");

    // ******** test WalletSimulator *********
    const selectedWallet: WalletBehavior = FullCompatibleSimulator;
    const swoSimulation: WALLET_API.StarknetWindowObject = new WalletSimulator(myProviderDevnetMainnet, myProviderDevnetTestnet, account1Mainnet, account0Testnet, selectedWallet);
    const myWalletAccount: WalletAccount = await WalletAccount.connect(myProviderDevnetTestnet, swoSimulation);
    const currentChainId = await myWalletAccount.getChainId();
    console.log({currentChainId});
    console.log("WA.addr :",myWalletAccount.address);
    console.log("WA.requestAccounts :",myWalletAccount.requestAccounts());
    

    // ****** Close devnets *******
    outputStreamTestnet.end();
    const pid: string[] = await kill(DEVNET_TESTNET_PORT);
    console.log("Devnet-rs Testnet stopped. Pid :", pid, "\nYou can close the log window.");
    outputStreamMainnet.end();
    const pidMainnet: string[] = await kill(DEVNET_MAINNET_PORT);
    console.log("Devnet-rs Mainnet stopped. Pid :", pidMainnet, "\nYou can close the log window.");

    console.log("✅ Test completed.\n");
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });