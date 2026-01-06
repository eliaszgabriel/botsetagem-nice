async function safeDM(user, content) {
  try {
    await user.send(content);
    return true;
  } catch {
    return false;
  }
}

module.exports = { safeDM };
