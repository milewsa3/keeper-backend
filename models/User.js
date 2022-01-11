const Sequelize = require('sequelize');
const db = require('../config/database');
const bcrypt = require('bcrypt')
const { hashPassword } = require('../utils/security')

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      len: [4, 20]
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      isEmail: true,
      isLowercase: true
    },
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      len: [6, undefined]
    },
    required: true,
  },
}, {
  instanceMethods: {
    authenticate: (value) => {
      if (bcrypt.compareSync(value, this.password))
        return this
      else
        return false
    }
  }
});

User.sync().then(() => {
  console.log('User table created');
});
User.beforeCreate(hashPassword)
module.exports = User;