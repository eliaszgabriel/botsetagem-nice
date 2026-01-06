const config = require("../config");
const { isStaff } = require("../utils/permissions");
const { buildRegisterModal } = require("../ui/registerModal");
const {
  buildReviewMessage,
  buildDisabledRow,
  extractDataFromReviewEmbed,
} = require("../ui/reviewMessage");
const { approve, reject } = require("../services/setagemService");

module.exports = function registerInteractionHandler(client) {
  client.on("interactionCreate", async (interaction) => {
    try {
      // Botão Registrar -> modal
      if (
        interaction.isButton() &&
        interaction.customId === "setagem:registrar"
      ) {
        return interaction.showModal(buildRegisterModal());
      }

      // Modal submit -> envia pro canal privado log-setagem
      if (
        interaction.isModalSubmit() &&
        interaction.customId === "setagem:modal"
      ) {
        const nome = interaction.fields.getTextInputValue("nome").trim();
        const playerId = interaction.fields
          .getTextInputValue("playerId")
          .trim();
        const telefone = interaction.fields
          .getTextInputValue("telefone")
          .trim();

        if (!/^\d+$/.test(playerId)) {
          return interaction.reply({
            content: "O **ID** precisa conter apenas números.",
            ephemeral: true,
          });
        }

        // Validação simples do telefone (aceita números, espaço, +, -, parênteses)
        if (!/^[0-9+\-() ]{5,20}$/.test(telefone)) {
          return interaction.reply({
            content: "O **Telefone** parece inválido. Use algo como: 234-213",
            ephemeral: true,
          });
        }

        const reviewChannel = await client.channels
          .fetch(config.channels.logSetagem)
          .catch(() => null);
        if (!reviewChannel || !reviewChannel.isTextBased()) {
          return interaction.reply({
            content: "Canal **log-setagem** não configurado.",
            ephemeral: true,
          });
        }

        await reviewChannel.send(
          buildReviewMessage({
            userId: interaction.user.id,
            nome,
            playerId,
            telefone,
          })
        );

        return interaction.reply({
          content:
            "Seu registro foi enviado para análise. Aguarde um responsável.",
          ephemeral: true,
        });
      }

      // Aprovar/Reprovar
      if (
        interaction.isButton() &&
        interaction.customId.startsWith("setagem:")
      ) {
        const parts = interaction.customId.split(":");
        if (parts.length !== 3) return;

        const [, action, targetId] = parts;

        if (action !== "aprovar" && action !== "reprovar") return;

        if (!interaction.inGuild()) {
          return interaction.reply({
            content: "Use isso dentro do servidor.",
            ephemeral: true,
          });
        }

        const staffMember = await interaction.guild.members.fetch(
          interaction.user.id
        );
        if (!isStaff(staffMember)) {
          return interaction.reply({
            content: "Você não tem permissão para aprovar/reprovar setagens.",
            ephemeral: true,
          });
        }

        const { nome, playerId, telefone } = extractDataFromReviewEmbed(
          interaction.message
        );
        if (!nome || !playerId || !telefone) {
          return interaction.reply({
            content:
              "Não encontrei os dados (Nome/ID/Telefone) nessa solicitação.",
            ephemeral: true,
          });
        }

        // ACK instantâneo (evita Unknown interaction)
        await interaction.deferUpdate();

        // trava botões imediatamente
        const disabledRow = buildDisabledRow(interaction.message);
        await interaction.message
          .edit({ components: [disabledRow] })
          .catch(() => {});

        if (action === "aprovar") {
          const result = await approve({
            client,
            guild: interaction.guild,
            staffId: interaction.user.id,
            targetId,
            nome,
            playerId,
            telefone,
          });

          await interaction.message.delete().catch(() => {});

          if (!result.ok) {
            await interaction
              .followUp({ content: `⚠️ ${result.reason}`, ephemeral: true })
              .catch(() => {});
          }
          return;
        }

        if (action === "reprovar") {
          await reject({
            client,
            staffId: interaction.user.id,
            targetId,
            nome,
            playerId,
            telefone,
          });

          await interaction.message.delete().catch(() => {});
          return;
        }
      }
    } catch (err) {
      console.error(err);

      if (interaction.isRepliable()) {
        try {
          if (interaction.deferred || interaction.replied) {
            await interaction.followUp({
              content: "Deu um erro ao processar isso.",
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: "Deu um erro ao processar isso.",
              ephemeral: true,
            });
          }
        } catch {}
      }
    }
  });
};
