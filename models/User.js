const Sequelize = require('sequelize');
const db = require('../config/database');
const bcrypt = require('bcrypt')
const { hashPassword, hashMasterPassword } = require('../utils/security')

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Please enter your name"
      },
      len: {
        args: [4, 20],
        msg: "Name must be 4-20 character long"
      }
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Please enter your email"
      },
      isEmail: {
        msg: "Enter correct email"
      },
      isLowercase: {
        msg: "Email must be lowercase"
      }
    },
    unique: {
      msg: "That email already exist"
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Please enter password"
      },
    },
    required: true
  },
  masterPassword: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Please enter master password"
      },
    },
    required: true
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
User.beforeCreate(hashMasterPassword)
module.exports = User;