const { Client, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config");
const registerInteractionHandler = require("./handlers/interactionCreate");
const { postSetagemMessage } = require("./deploy/postSetagemMessage");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

registerInteractionHandler(client);

client.once("ready", async () => {
  console.log(`[OK] Logado como ${client.user.tag}`);

  // Se quiser postar automaticamente toda vez que ligar, deixe.
  // Se não quiser, comente e rode manualmente só 1 vez.
  await postSetagemMessage(client);
});

client.login(config.token);
