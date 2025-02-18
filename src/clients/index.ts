import { AutoClientInterface } from "@elizaos/client-auto";
import { DiscordClientInterface } from "@elizaos/client-discord";
//import { TelegramClientInterface } from "@elizaos/client-telegram";
import { TwitterClientInterface } from "@elizaos/client-twitter";
import { Character, IAgentRuntime } from "@elizaos/core";
import { elizaLogger } from "@elizaos/core";
import { validateTelegramConfig } from "./environment.ts";
//import { TelegramClient } from "../clients/telegramClient.ts";
import { TelegramClientInterface } from "./teleGramPlugin.ts";

export  async function initializeClients(
  character: Character,
  runtime: IAgentRuntime
) {
  const clients = [];
  const clientTypes =
      character.clients?.map((str) => str.toLowerCase()) || [];

  if (clientTypes.includes("auto")) {
      const autoClient = await AutoClientInterface.start(runtime);
      if (autoClient) clients.push(autoClient);
  }

  if (clientTypes.includes("discord")) {
      clients.push(await DiscordClientInterface.start(runtime));
  }

  if (clientTypes.includes("telegram")) {
      const telegramClient = await TelegramClientInterface.start(runtime);
      //// Process message content
      
      if (telegramClient) clients.push(telegramClient);
      
  }

  if (clientTypes.includes("twitter")) {
      const twitterClients = await TwitterClientInterface.start(runtime);
      clients.push(twitterClients);
     
  }

  if (character.plugins?.length > 0) {
      for (const plugin of character.plugins) {
          if (plugin.clients) {
              for (const client of plugin.clients) {
                  clients.push(await client.start(runtime));
              }
          }
      }
  }

  return clients;
}


class TelegramClient {
  async handleMessage(message) {
    // Process message content
    const content = await this.processMessage(message);

    // Generate response
    const response = await this.generateResponse(content);

    // Send response
    await this.sendMessage(message.chat.id, response);
  }

  async processMessage(message) {
    // Implement your message processing logic here
    return message.text; // Example: return the text of the message
  }

  async generateResponse(content) {
    // Implement your response generation logic here
    
    return `You said: ${content}`; // Example: echo the message
  }

  async sendMessage(chatId, response) {
    try {
      console.log(`Attempting to send message to chat ${chatId}: ${response}`);
      // Use Telegram API to send the message
      //await bot.api.sendMessage(chatId, response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}
