const { PermissionsBitField } = require("discord.js");
const config = require("../config");
const { safeDM } = require("../utils/safeDM");
const { sendLog } = require("./logService");

async function approve({
  client,
  guild,
  staffId,
  targetId,
  nome,
  playerId,
  telefone,
}) {
  const targetMember = await guild.members.fetch(targetId).catch(() => null);
  if (!targetMember) {
    return {
      ok: false,
      reason: "Usuário não encontrado no servidor (talvez saiu).",
    };
  }

  const me = guild.members.me;
  const canNick = me.permissions.has(PermissionsBitField.Flags.ManageNicknames);
  const canRoles = me.permissions.has(PermissionsBitField.Flags.ManageRoles);

  const newNick = `${nome} | ${playerId}`.slice(0, 32);

  if (canNick) await targetMember.setNickname(newNick).catch(() => {});
  if (canRoles)
    await targetMember.roles.add(config.roles.membro).catch(() => {});

  const dmOk = await safeDM(
    targetMember.user,
    `Você foi aprovado no registro.\nNome setado: ${newNick}`
  );

  await sendLog(client, "approved", {
    staffId,
    targetId,
    nome,
    playerId,
    telefone,
    dmOk,
  });

  return { ok: true };
}

async function reject({ client, staffId, targetId, nome, playerId, telefone }) {
  const user = await client.users.fetch(targetId).catch(() => null);

  const dmOk = user
    ? await safeDM(
        user,
        "Seu registro foi reprovado. Se necessário, refaça o registro."
      )
    : false;

  await sendLog(client, "rejected", {
    staffId,
    targetId,
    nome,
    playerId,
    telefone,
    dmOk,
  });

  return { ok: true };
}

module.exports = { approve, reject };
