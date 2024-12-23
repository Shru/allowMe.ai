# Eliza GOAT XMAS Agent
*Built with GOAT 🐐*

This fork is a **simplified example of Eliza focused on executing transactions onchain on Mode** using [GOAT](https://github.com/goat-sdk/goat-sdk).

**Onchain actions**:
- Mint NFTs
- Check the latest trending tokens
- Purchase, trade them, and much more.

Tech stack:
- [Eliza](https://github.com/ai16z/eliza) - The AI agent framework
- [GOAT](https://github.com/goat-sdk/goat-sdk) - The open-source framework for connecting AI agents to any onchain app

**Support**
- [Discord](https://discord.gg/goat-sdk)


## Running the project
### Requirements
- Node.js 23.3.0+

### Set up

1. Clone the repository
```bash
git clone https://github.com/goat-sdk/xmas-agent.git
```

2. Go into the project directory
```bash
cd xmas-agent
```

3. Install the dependencies
```bash
pnpm install
```

4. Run `pnpm build`

5. Copy the .env.example file to .env:
```bash
cp .env.example .env
```

6. Get an OpenAI API key and fill in the `OPENAI_API_KEY` in the .env file

### Giving the agent a wallet

1. This example uses a key pair wallet. Save the key and fill in the following in the .env file:
    - `EVM_PRIVATE_KEY=`
    - `EVM_PROVIDER_URL=

### Running the agent

1. You can now run the agent with the command `pnpm start --character="characters/xmas-goat.character.json"`
2. In a different terminal run `pnpm start:client` to start the chat interface
3. Go to `http://localhost:5173` to chat with your agent


## Configuring the project
### The character
- You can see the definition of your character in the `characters/xmas-goat.character.json` file.
- This project gives you a simple example character to get you started. This allows you to easily add onchain actions and test them out while increasing the complexity of your agent step by step. Keep adding and modifying the bio and tone of the character to make it your own.

### Eliza
- This is an Eliza fork so you can do pretty much everything you can do with Eliza. Check out the [Eliza docs](https://ai16z.github.io/eliza/) for more information on how to integrate your agent with Twitter, Discord, etc.

### Onchain actions with GOAT
- The GOAT plugin (`packages/plugin-goat`) uses GOAT to add all onchain functionality to the agent. Within the `actions.ts` file of the plugin you can add any GOAT plugins you need or even create your own. Check out the [GOAT docs](https://ohmygoat.dev) for more information.
```typescript
export async function getOnChainActions(wallet: WalletClientBase) {
    const actionsWithoutHandler = [
        {
            name: "SEND_ETH",
            description: "Send ETH to a given address",
            similes: [],
            validate: async () => true,
            examples: [],
        },
        {
            name: "SEND_USDC",
            description: "Send USDC to a given address",
            similes: [],
            validate: async () => true,
            examples: [],
        },
        {
            name: "GET_USDC_BALANCE",
            description: "Get the balance of USDC in the wallet",
            similes: [],
            validate: async () => true,
            examples: [],
        },
        // 1. Add your actions here
    ];

    const tools = await getOnChainTools({
        wallet: wallet,
        // 2. Configure the plugins you need to perform those actions
        plugins: [sendETH(), erc20({ tokens: [USDC] })],
    });

    // 3. Let GOAT handle all the actions
    return actionsWithoutHandler.map((action) => ({
        ...action,
        handler: getActionHandler(action.name, action.description, tools),
    }));
}
```

## Tips for troubleshooting
1. When making changes to any package (e.g the Crossmint plugin), remember to run `pnpm build` to update the project.
2. To see why the agent is making a certain decision, add console logs to see the prompts and responses that it is getting on every interaction. For example. if you are using the direct client that would be [here](https://github.com/goat-sdk/eliza-solana-example/blob/main/packages/client-direct/src/index.ts#L135).
3. You can also copy the agent prompts that you log and play with them in ChatGPT to see how you could improve them.
