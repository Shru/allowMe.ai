# AllowMe.ai

AllowMe.ai is an AI-powered educational finance platform that automates allowance distribution based on verified educational achievements. Built on ElizaOS's agent framework and Polygon blockchain.


Mission

To create an autonomous, transparent, and incentive-driven learning ecosystem where:
✅ AI tutors help students fill knowledge gaps.
✅ Smart contracts unlock funds based on verified educational achievements.
✅ Parents have full financial oversight while allowing children autonomy in everyday transactions.

Core Product Offerings:

1. TutorAgent - AI - Powered Learning & Assesment

An AI-driven tutoring assistant that helps students:
✅ Generate Custom Quizzes – AI crafts multiple-choice tests tailored to skill level.
✅ Identify Learning Gaps – AI analyzes responses to highlight weak areas.
✅ Provide Smart Recommendations – Personalized study materials & interventions.
💰 Subscription Model – $10/month for access to AI-driven learning.


2. Parental - Controlled Wallet & Allowance System

A smart contract-powered finance system that automates allowance distribution based on verified achievements.
✅ Unlock Funds Upon Task Completion – Parents set learning or health-based goals (e.g., “complete a quiz,” “walk 2,000 steps”) before funds are released.
✅ Day-to-Day Financial Autonomy for Kids – Small transactions approved automatically, while parents oversee larger ones.
✅ Blockchain Transparency – Funds are managed through Web3 wallets with full parental oversight.
💰 Premium Plan – $20/month for financial automation


## Core Problem

Parents and trustees struggle to:

Motivate children to learn valuable skills

Control digital spending (Robux, gaming, etc.)

Verify actual achievements

Balance rewards with development

Implement consistent reward systems

Track progress objectively




## 🎯 Solution

AllowMe.ai transforms traditional allowance systems by:
- Creating AI-verified educational achievements
- Automating reward distribution via smart contracts
- Teaching financial literacy through hands-on experience
- Providing secure parental controls and oversight

## 🛠️ Technical Architecture

- **ElizaOS Integration**
 - Assessment Agent: Creates and validates educational activities
 - Reward Agent: Manages automated allowance distribution
 - Mass Payments Plugin: Handles on-chain transactions
 - Goat-Plugin

- **Smart Contracts**
 - Achievement verification
 - Automated rewards
 - Parental controls
 - Spending limits

## 🚀 Features

### For Parents/Trustees
- Custom educational goal setting
- Spending parameter controls 
- Progress monitoring dashboard
- Transaction oversight

### For Students
- Educational achievement tracking
- Digital wallet management
- Progress visualization
- Reward history



## 💻 Integrations 





# Client Integrated 

https://github.com/elizaOS/eliza/tree/main/packages/client-telegram





# PlugIns To be Integrated 

https://github.com/coinbase/cdp-agentkit-nodejs/tree/5d686bbfbc5607d7b7d0f188c8c120d623e5aa32/cdp-agentkit-core

https://github.com/elizaOS/eliza/tree/main/packages/plugin-coinbase

https://github.com/elizaOS/eliza/blob/main/packages/plugin-coinbase/src/plugins/massPayments.ts

https://github.com/elizaOS/eliza/blob/main/packages/plugin-goat/src/wallet.ts

## Edit the character files

Open `src/character.ts` to modify the default character. Uncomment and edit.

### Custom characters

To load custom characters instead:
- Use `pnpm start --characters="path/to/your/character.json"`
- Multiple character files can be loaded simultaneously

### Add clients
```
clients: [Clients.TWITTER, Clients.DISCORD],
```

## Duplicate the .env.example template

```bash
cp .env.example .env
```

\* Fill out the .env file with your own values.

### Add login credentials and keys to .env
```
DISCORD_APPLICATION_ID="discord-application-id"
DISCORD_API_TOKEN="discord-api-token"
...
OPENROUTER_API_KEY="sk-xx-xx-xxx"
...
TWITTER_USERNAME="username"
TWITTER_PASSWORD="password"
TWITTER_EMAIL="your@email.com"
```

## Install dependencies and start your agent

```bash
pnpm i && pnpm start
```
Note: this requires node to be at least version 22 when you install packages and run the agent.
