import { DirectClient } from "@elizaos/client-direct";
//import {DirectClient2} from "./directClient2.ts";
import createGoatPlugin from "@elizaos/plugin-goat";




import { IVideoService } from "@elizaos/core";
import * as cheerio from 'cheerio';
import { createRaribleSdk } from "@rarible/sdk"
import axios from 'axios';
import {
  AgentRuntime,
  elizaLogger,
  settings,
  stringToUuid,
  defaultCharacter,
  validateCharacterConfig,
  type Character,
} from "@elizaos/core";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import { VideoService } from "@elizaos/plugin-node";
import {BrowserService} from "@elizaos/plugin-node";
import { createNodePlugin } from "@elizaos/plugin-node";
import { solanaPlugin } from "@elizaos/plugin-solana";
import fs from "fs";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";
import { initializeDbCache } from "./cache/index.ts";
import { janeBot } from "./character.ts";

//import { reactPro } from "./characterTutor.ts";
//import { pyAssist } from "./characterPyassist.ts";
//import { mainCharacter } from "./mainCharacter.ts";

import { startChat } from "./chat/index.ts";
import { initializeClients } from "./clients/index.ts";


import {
  getTokenForProvider,
  loadCharacters,
  parseArguments,
} from "./config/index.ts";
import { initializeDatabase } from "./database/index.ts";
import express from 'express';
//import puppeteer from 'puppeteer';
//import FirecrawlApp, { CrawlParams, CrawlStatusResponse } from '@mendable/firecrawl-js';






const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





export const wait = (minTime: number = 1000, maxTime: number = 3000) => {
  const waitTime =
    Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  return new Promise((resolve) => setTimeout(resolve, waitTime));
};

let nodePlugin: any | undefined;

export async function createAgent(
  character: Character,
  db: any,
  cache: any,
  token: string
) {
  elizaLogger.success(
    elizaLogger.successesTitle,
    "Creating runtime for character",
    character.name,
  );
  

  nodePlugin ??= createNodePlugin();

  let goatPlugin: any | undefined;

  // Initialize goat plugin if EVM private key is present
  if (getSecret(character, "EVM_PRIVATE_KEY")) {
      goatPlugin = await createGoatPlugin((secret) =>
          getSecret(character, secret)
      );
  }
  

  // Initialize browser service
  const browserService = new BrowserService();


  return new AgentRuntime({
    databaseAdapter: db,
    token,
    modelProvider: character.modelProvider,
    evaluators: [],
    character,
    plugins: [
      bootstrapPlugin,
      nodePlugin,
      character.settings?.secrets?.WALLET_PUBLIC_KEY ? solanaPlugin : null,
      getSecret(character, "EVM_PROVIDER_URL") ? goatPlugin : null,
    ].filter(Boolean),
    providers: [],
    actions: [],
    services: [],
    managers: [],
    cacheManager: cache,
  });
}

function getSecret(character: Character, secret: string) {
  return character.settings?.secrets?.[secret] || process.env[secret];
}
function tryLoadFile(filePath: string): string | null {
	try {
		return fs.readFileSync(filePath, "utf8")
	} catch (e) {
		return null
	}
}
function mergeCharacters(base: Character, child: Character): Character {
	const mergeObjects = (baseObj: any, childObj: any) => {
		const result: any = {}
		const keys = new Set([...Object.keys(baseObj || {}), ...Object.keys(childObj || {})])
		keys.forEach((key) => {
			if (typeof baseObj[key] === "object" && typeof childObj[key] === "object" && !Array.isArray(baseObj[key]) && !Array.isArray(childObj[key])) {
				result[key] = mergeObjects(baseObj[key], childObj[key])
			} else if (Array.isArray(baseObj[key]) || Array.isArray(childObj[key])) {
				result[key] = [...(baseObj[key] || []), ...(childObj[key] || [])]
			} else {
				result[key] = childObj[key] !== undefined ? childObj[key] : baseObj[key]
			}
		})
		return result
	}
	return mergeObjects(base, child)
}

async function handlePluginImporting(plugins: string[]) {
	if (plugins.length > 0) {
		elizaLogger.info("Plugins are: ", plugins)
		const importedPlugins = await Promise.all(
			plugins.map(async (plugin) => {
				try {
					const importedPlugin = await import(plugin)
					const functionName = plugin.replace("@elizaos/plugin-", "").replace(/-./g, (x) => x[1].toUpperCase()) + "Plugin" // Assumes plugin function is camelCased with Plugin suffix
					return importedPlugin.default || importedPlugin[functionName]
				} catch (importError) {
					elizaLogger.error(`Failed to import plugin: ${plugin}`, importError)
					return [] // Return null for failed imports
				}
			})
		)
		return importedPlugins
	} else {
		return []
	}
}

async function jsonToCharacter(filePath: string, character: any): Promise<Character> {
	validateCharacterConfig(character)

	// .id isn't really valid
	const characterId = character.id || character.name
	const characterPrefix = `CHARACTER.${characterId.toUpperCase().replace(/ /g, "_")}.`
	const characterSettings = Object.entries(process.env)
		.filter(([key]) => key.startsWith(characterPrefix))
		.reduce((settings, [key, value]) => {
			const settingKey = key.slice(characterPrefix.length)
			return { ...settings, [settingKey]: value }
		}, {})
	if (Object.keys(characterSettings).length > 0) {
		character.settings = character.settings || {}
		character.settings.secrets = {
			...characterSettings,
			...character.settings.secrets,
		}
	}
	// Handle plugins
	character.plugins = await handlePluginImporting(character.plugins)
	if (character.extends) {
		elizaLogger.info(`Merging  ${character.name} character with parent characters`)
		for (const extendPath of character.extends) {
			const baseCharacter = await loadCharacter(path.resolve(path.dirname(filePath), extendPath))
			character = mergeCharacters(baseCharacter, character)
			elizaLogger.info(`Merged ${character.name} with ${baseCharacter.name}`)
		}
	}
	return character
}

async function loadCharacter(filePath: string): Promise<Character> {
	const content = tryLoadFile(filePath)
	if (!content) {
		throw new Error(`Character file not found: ${filePath}`)
	}
	const character = JSON.parse(content)
	return jsonToCharacter(filePath, character)
}




interface NFTCollection {
  name: string;
  volume24h: number;
  floorPrice: number;
  items: number;
  owners: number;
 }

 


 

async function startAgent(character: Character, directClient: DirectClient) {
  try {
    character.id ??= stringToUuid(character.name);
    character.username ??= character.name;

    const token = getTokenForProvider(character.modelProvider, character);
    const dataDir = path.join(__dirname, "../data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const db = initializeDatabase(dataDir);

    await db.init();

    const cache = initializeDbCache(character, db);
    const runtime = await createAgent(character, db, cache, token);

    await runtime.initialize();

    
    const browserService = new BrowserService();

    
  

    

   
    // Replace Puppeteer with Firecrawl
   // const raribleContent = await getRaribleCollectionsWithFirecrawl();
   // const processedContent = await browserService.getPageContent("https://rarible.com/drops", runtime);
    
   // console.log(processedContent);
    // get page content
    

    runtime.clients = await initializeClients(character, runtime);

    directClient.registerAgent(runtime);

    // report to console
    elizaLogger.debug(`Started ${character.name} as ${runtime.agentId}`);

    return runtime;
  } catch (error) {
    elizaLogger.error(
      `Error starting agent for character ${character.name}:`,
      error,
    );
    console.error(error);
    throw error;
  }
}

const checkPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        resolve(false);
      }
    });

    server.once("listening", () => {
      server.close();
      resolve(true);
    });

    server.listen(port);
  });
};

//handle plugin importing when we start the agents

const hasValidRemoteUrls = () => process.env.REMOTE_CHARACTER_URLS && process.env.REMOTE_CHARACTER_URLS !== "" && process.env.REMOTE_CHARACTER_URLS.startsWith("http")

const startAgents = async () => {
  const directClient = new DirectClient();
 // const directClient2 = new DirectClient2();
  


  let serverPort = parseInt(settings.SERVER_PORT || "3000");
  const args = parseArguments();

  let charactersArg = args.characters || args.character;
  let characters = [defaultCharacter];

  console.log("charactersArg", charactersArg);
  if (charactersArg) {
    characters = await loadCharacters(charactersArg);
  }
  console.log("characters", characters);
  try {
    for (const character of characters) {
      await startAgent(character, directClient as DirectClient);
    }
  } catch (error) {
    elizaLogger.error("Error starting agents:", error);
  }

  while (!(await checkPortAvailable(serverPort))) {
    elizaLogger.warn(`Port ${serverPort} is in use, trying ${serverPort + 1}`);
    serverPort++;
  }

  // upload some agent functionality into directClient
  directClient.startAgent = async (character: Character) => {
    // wrap it so we don't have to inject directClient later
    return startAgent(character, directClient);
  };

  

  directClient.start(serverPort);
 // directClient2.start(serverPort);
  
 if (serverPort !== parseInt(settings.SERVER_PORT || "3000")) {
    elizaLogger.log(`Server started on alternate port ${serverPort}`);
  }

  const isDaemonProcess = process.env.DAEMON_PROCESS === "true";
  if(!isDaemonProcess) {
    elizaLogger.log("Chat started. Type 'exit' to quit.");
    const chat = startChat(characters);
    chat();
  }
};

startAgents().catch((error) => {
  elizaLogger.error("Unhandled error in startAgents:", error);
  process.exit(1);
});

