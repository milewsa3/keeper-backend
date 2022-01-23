const Sequelize = require('sequelize');
const db = require('../config/database');
const { hashPassword, hashPasswordEntity, encryptPasswordEntity } = require('../utils/security');

const PasswordEntity = db.define('passwordEntity', {
  pageUrl: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  iv: {
    type: Sequelize.STRING
  },
  userId: {
    type: Sequelize.INTEGER
  }
});

PasswordEntity.sync().then(() => {
  console.log('Password entity table created');
});
module.exports = PasswordEntity;