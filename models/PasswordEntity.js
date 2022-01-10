const Sequelize = require('sequelize');
const db = require('../config/database');

const PasswordEntity = db.define('passwordEntity', {
  page_url: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  salt: {
    type: Sequelize.STRING
  },
});

PasswordEntity.sync().then(() => {
  console.log('Password entity table created');
});
module.exports = PasswordEntity;