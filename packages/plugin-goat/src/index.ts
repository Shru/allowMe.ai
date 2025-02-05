import type { Plugin } from "@elizaos/core";
import { getOnChainActions } from "./actions.ts";
import { getWalletClient, getWalletProvider } from "./wallet.ts";

async function createGoatPlugin(
    getSetting: (key: string) => string | undefined
): Promise<Plugin> {
    const walletClient = getWalletClient(getSetting);
    const actions = await getOnChainActions(walletClient);

    return {
        name: "[GOAT] Onchain Actions",
        description: "Mode integration plugin",
        providers: [getWalletProvider(walletClient)],
        evaluators: [],
        services: [],
        actions: actions,
    };
}

export default createGoatPlugin;