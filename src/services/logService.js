const { EmbedBuilder } = require("discord.js");
const config = require("../config");

async function sendLog(client, type, payload) {
  const channel = await client.channels
    .fetch(config.channels.logAprovados)
    .catch(() => null);

  if (!channel || !channel.isTextBased()) return;

  // 🔹 busca o usuário para pegar o avatar
  const user = await client.users.fetch(payload.targetId).catch(() => null);
  const avatarUrl = user?.displayAvatarURL({ size: 128 }) || null;

  // 🔹 cores dinâmicas
  const color = type === "approved" ? "#2ecc71" : "#e74c3c";

  const embed = new EmbedBuilder()
    .setTitle(type === "approved" ? "Setagem Aprovada" : "Setagem Reprovada")
    .setColor(color) // ✅ AQUI ESTÁ O DIFERENCIAL
    .addFields(
      {
        name: type === "approved" ? "Aprovado" : "Reprovado",
        value: `<@${payload.targetId}>`,
        inline: true,
      },
      {
        name: "Nome | ID",
        value: `${payload.nome} | ${payload.playerId}`,
        inline: true,
      },
      {
        name: "Telefone",
        value: payload.telefone || "Não informado",
        inline: true,
      },
      {
        name: type === "approved" ? "Quem aprovou" : "Quem reprovou",
        value: `<@${payload.staffId}>`,
        inline: false,
      },
      {
        name: "DM enviada",
        value: payload.dmOk ? "Sim" : "Não (DM fechada/erro)",
        inline: true,
      }
    )
    .setFooter({ text: "Sistema de Setagem" })
    .setTimestamp();

  // 🔹 avatar pequenininho no canto
  if (avatarUrl) {
    embed.setThumbnail(avatarUrl);
  }

  await channel.send({ embeds: [embed] });
}

module.exports = { sendLog };
