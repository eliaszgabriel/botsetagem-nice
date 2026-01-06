const config = require("../config");
const { buildRegisterMessage } = require("../ui/registerMessage");

async function postSetagemMessage(client) {
  const channel = await client.channels
    .fetch(config.channels.setagem)
    .catch(() => null);
  if (!channel || !channel.isTextBased())
    throw new Error("Canal setagem inválido.");

  // ✅ agora passa client para pegar o avatar no thumbnail
  const msg = await channel.send(buildRegisterMessage(client));
  return msg;
}

module.exports = { postSetagemMessage };
