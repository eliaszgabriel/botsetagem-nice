const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const config = require("../config");

function getRegistrarStyle() {
  return config.ui.registrarStyle === "red"
    ? ButtonStyle.Danger
    : ButtonStyle.Primary;
}

// Agora recebe client pra poder usar o avatar do bot no thumbnail
function buildRegisterMessage(client) {
  const embed = new EmbedBuilder()
    .setTitle("Registro de Acesso")
    .setDescription(
      [
        "Para concluir seu registro, clique no botão abaixo e preencha os dados solicitados.",
        "",
        "Após o envio, sua solicitação será analisada pela liderança/recrutamento.",
      ].join("\n")
    )
    .addFields(
      {
        name: "O que será solicitado",
        value: "Nome, ID e Telefone.",
        inline: false,
      },
      {
        name: "Atenção",
        value: "Preencha corretamente para evitar reprovação.",
        inline: false,
      }
    )
    .setFooter({ text: "Desenvolvido por 44els" });

  // Logo do bot (pequeninho) no canto
  const avatar = client?.user?.displayAvatarURL?.() || null;
  if (avatar) embed.setThumbnail(avatar);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("setagem:registrar")
      .setLabel("Registrar")
      .setStyle(getRegistrarStyle())
  );

  return { embeds: [embed], components: [row] };
}

module.exports = { buildRegisterMessage };
