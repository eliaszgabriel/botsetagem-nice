require("dotenv").config();

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Faltando ${name} no .env`);
  return v;
}

module.exports = {
  token: required("DISCORD_TOKEN"),

  channels: {
    setagem: required("SETAGEM_CHANNEL_ID"),
    logSetagem: required("LOG_SETAGEM_CHANNEL_ID"),
    logAprovados: required("LOG_APROVADOS_CHANNEL_ID"),
  },

  roles: {
    membro: required("ROLE_MEMBRO_ID"),
    lider: required("ROLE_LIDER_ID"),
    recrutador: required("ROLE_RECRUTADOR_ID"),
  },

  ui: {
    registrarStyle: (
      process.env.REGISTRAR_BUTTON_STYLE || "blue"
    ).toLowerCase(), // blue|red
  },
};
