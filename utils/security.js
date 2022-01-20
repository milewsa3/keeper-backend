const bcrypt = require('bcrypt')
const passwordValidator = require('password-validator');

module.exports.isStrongPassword = (password) => {
  const schema = new passwordValidator()

  schema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)
  .has().symbols(1)
  .has().not().spaces()

  return schema.validate(password)
}

module.exports.hashPassword = async (user, options) => {
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
}

module.exports.hashMasterPassword = async (user, options) => {
  const salt = await bcrypt.genSalt();
  user.masterPassword = await bcrypt.hash(user.masterPassword, salt);
}