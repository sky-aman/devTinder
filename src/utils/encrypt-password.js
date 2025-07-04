const bcrypt = require('bcrypt');

async function encryptPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return hashedPassword;
}

module.exports = encryptPassword;