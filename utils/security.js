const bcrypt = require('bcrypt')
const crypto = require('crypto');
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

module.exports.isStrongMasterPassword = (password) => {
  const schema = new passwordValidator()

  schema
  .is().min(8)
  .is().max(32)
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

const algorithm = 'aes-256-cbc';

const paddingMasterPassword = (masterPassword) => {
  const passwordLength = masterPassword.length
  const keyLength = crypto.getCipherInfo(algorithm).keyLength

  for (let i = 0; i < keyLength - passwordLength; i++) {
    masterPassword += '='
  }

  return masterPassword
}

module.exports.encryptPasswordEntity = async (passwordEntity, masterPassword) => {
  masterPassword = paddingMasterPassword(masterPassword)
  const iv = crypto.randomBytes(16);

  for (let i = 0; i < 2; i++) {
    const cipher = crypto.createCipheriv(algorithm, masterPassword, iv);
    const encrypted = Buffer.concat([cipher.update(passwordEntity.password), cipher.final()]);

    passwordEntity.password = encrypted.toString('hex')
  }

  passwordEntity.iv = iv.toString('hex')
}

module.exports.decryptPasswordEntity = async (passwordEntity, masterPassword) => {
  masterPassword = paddingMasterPassword(masterPassword)

  for (let i = 0; i < 2; i++) {
    const decipher = crypto.createDecipheriv(algorithm,
      masterPassword,
      Buffer.from(passwordEntity.iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(passwordEntity.password,
      'hex')), decipher.final()]);

    passwordEntity.password = decrypted.toString();
  }
}