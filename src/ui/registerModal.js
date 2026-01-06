const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

function buildRegisterModal() {
  const modal = new ModalBuilder()
    .setCustomId("setagem:modal")
    .setTitle("Registro");

  const inputNome = new TextInputBuilder()
    .setCustomId("nome")
    .setLabel("Seu nome")
    .setStyle(TextInputStyle.Short)
    .setMaxLength(32)
    .setRequired(true)
    .setPlaceholder("Ex: Elias");

  const inputId = new TextInputBuilder()
    .setCustomId("playerId")
    .setLabel("Seu ID")
    .setStyle(TextInputStyle.Short)
    .setMaxLength(10)
    .setRequired(true)
    .setPlaceholder("Ex: 987");

  const inputTelefone = new TextInputBuilder()
    .setCustomId("telefone")
    .setLabel("Telefone")
    .setStyle(TextInputStyle.Short)
    .setMaxLength(20)
    .setRequired(true)
    .setPlaceholder("Ex: 234-213");

  modal.addComponents(
    new ActionRowBuilder().addComponents(inputNome),
    new ActionRowBuilder().addComponents(inputId),
    new ActionRowBuilder().addComponents(inputTelefone)
  );

  return modal;
}

module.exports = { buildRegisterModal };
