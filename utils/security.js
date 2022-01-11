const bcrypt = require('bcrypt')

module.exports.hashPassword = async (user, options) => {
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
}