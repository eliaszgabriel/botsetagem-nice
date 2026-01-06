const { PermissionsBitField } = require("discord.js");
const config = require("../config");

function isStaff(member) {
  if (!member) return false;

  const hasRole =
    member.roles.cache.has(config.roles.lider) ||
    member.roles.cache.has(config.roles.recrutador);

  const isAdmin = member.permissions.has(
    PermissionsBitField.Flags.Administrator
  );

  return hasRole || isAdmin;
}

module.exports = { isStaff };
