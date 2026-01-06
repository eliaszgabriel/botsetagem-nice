const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

function buildReviewMessage({ userId, nome, playerId, telefone }) {
  const embed = new EmbedBuilder()
    .setTitle("Pedido de Setagem")
    .addFields(
      { name: "Usuário", value: `<@${userId}> (${userId})`, inline: false },
      { name: "Nome", value: nome, inline: true },
      { name: "ID", value: playerId, inline: true },
      { name: "Telefone", value: telefone, inline: true }
    )
    .setFooter({ text: "Aguardando aprovação/reprovação" })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`setagem:aprovar:${userId}`)
      .setLabel("Aprovar")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`setagem:reprovar:${userId}`)
      .setLabel("Reprovar")
      .setStyle(ButtonStyle.Danger)
  );

  return { embeds: [embed], components: [row] };
}

function buildDisabledRow(message) {
  const row = new ActionRowBuilder().addComponents(
    ButtonBuilder.from(message.components[0].components[0]).setDisabled(true),
    ButtonBuilder.from(message.components[0].components[1]).setDisabled(true)
  );
  return row;
}

function extractDataFromReviewEmbed(message) {
  const embed = message.embeds?.[0];
  const fields = embed?.fields || [];
  const nome = fields.find((f) => f.name === "Nome")?.value;
  const playerId = fields.find((f) => f.name === "ID")?.value;
  const telefone = fields.find((f) => f.name === "Telefone")?.value;
  return { nome, playerId, telefone };
}

module.exports = {
  buildReviewMessage,
  buildDisabledRow,
  extractDataFromReviewEmbed,
};
