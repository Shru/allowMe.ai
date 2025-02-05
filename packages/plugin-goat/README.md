@elizaos/plugin-goat
A plugin for integrating blockchain capabilities through the GOAT (Great Onchain Agent Toolkit) framework within the ElizaOS ecosystem.

Description
GOAT 🐐 (Great Onchain Agent Toolkit) is an open-source framework for adding blockchain tools such as wallets, being able to hold or trade tokens, or interacting with blockchain smart contracts, to your AI agent.

Chains supported
Plugins supported
This plugin integrates GOAT with Eliza, giving your agent the ability to interact with many different protocols. The current setup adds onchain capabilities to your agent to send and check balances of ETH and USDC, and to swap tokens using KIM protocol. Add all the capabilities you need by adding more plugins (read below for more information)!

Installation
pnpm install @elizaos/plugin-goat
Configuration
Environment Variables
EVM_PRIVATE_KEY=<Your EVM wallet private key>
EVM_PROVIDER_URL=<Your RPC provider URL (e.g., Infura, Alchemy)>
Configure GOAT for your use case
Configure the chain you want to use by updating the wallet.ts file (see all available chains at https://ohmygoat.dev/chains)
Specify the actions you want to have by updating the actions.ts file
Add the plugins you need to perform these actions to the getOnChainTools function (uniswap, polymarket, etc. see all available plugins at https://ohmygoat.dev/chains-wallets-plugins)
Build the project running pnpm build
Add the necessary environment variables to set up your wallet and plugins
Run your agent!
Common Issues
Agent not executing an action:
If you are also using the EVM Plugin, sometimes the agent might confuse the action name with an EVM Plugin action name instead of the GOAT Plugin action. Removing the EVM Plugin should fix this issue. There is no need for you to use both plugins at the same time.
If you are using Trump as a character it might be tricky to get them to perform any action since the character is full of prompts that aim to change the topic of the conversation. To fix this try using a different character or create your own with prompts that are more suitable to what the agent is supposed to do.
Plugins
GOAT itself has several plugins for interacting with different protocols such as Polymarket, Uniswap, and many more. (see all available plugins at https://ohmygoat.dev/chains-wallets-plugins)

You can easily add them by installing them and adding them to the getOnChainActions function:

const tools = getOnChainActions({
    wallet: walletClient,
    plugins: [
        sendETH(),
        erc20({ tokens: [USDC, PEPE] }),
        polymarket(),
        uniswap(),
        // ...
    ],
});
See all available plugins at https://ohmygoat.dev/chains-wallets-plugins

Common Issues & Troubleshooting
Agent not executing an action:

If you are also using the EVM Plugin, sometimes the agent might confuse the action name with an EVM Plugin action name instead of the GOAT Plugin action. Removing the EVM Plugin should fix this issue. There is no need for you to use both plugins at the same time.
If you are using Trump as a character it might be tricky to get them to perform any action since the character is full of prompts that aim to change the topic of the conversation. To fix this try using a different character or create your own with prompts that are more suitable to what the agent is supposed to do.
Wallet Connection Issues

Verify private key is correctly formatted
Check RPC endpoint availability
Ensure sufficient network balance
Transaction Issues

Verify gas availability
Check network congestion
Confirm transaction parameters
Wallets
GOAT supports many different wallets from key pairs to Crossmint Smart Wallets and Coinbase.

Read more about wallets at https://ohmygoat.dev/wallets.

Security Best Practices
Key Management

Store private keys securely
Use environment variables
Never expose keys in code
Transaction Safety

Implement transaction limits
Validate recipient addresses
Double-check transaction amounts
Network Security

Use secure RPC endpoints
Implement rate limiting
Monitor for suspicious activity
Development Guide
Setting Up Development Environment
Clone the repository
Install dependencies:
pnpm install
Build the plugin:
pnpm run build
Future Enhancements
Additional protocol integrations
Multi-chain support
Advanced transaction management
Enhanced error handling
Custom protocol adapters
Smart contract interaction templates
Contributing
Contributions are welcome! Please see the CONTRIBUTING.md file for more information.

Credits
This plugin integrates with and builds upon several key technologies:

GOAT: Great Onchain Agent Toolkit
Crossmint: Smart wallet infrastructure
Uniswap: Decentralized exchange protocol
Polymarket: Prediction market platform
ERC20: Token standard implementation
Special thanks to:

The GOAT development team for the onchain agent framework
The Crossmint team for smart wallet solutions
The Uniswap and Polymarket teams
The Ethereum community for ERC standards
The Eliza community for their contributions and feedback
For more information about GOAT capabilities:

GOAT Documentation
Available Chains
Chains, Wallets & Plugins
Smart Wallet Documentation
License
This plugin is part of the Eliza project. See the main project repository for license information.