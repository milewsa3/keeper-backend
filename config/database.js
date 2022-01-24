const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const ssl_config = () => {
  if (process.env.SSL_ENABLED === 'true') {
    return {
      require: process.env.SSL_REQUIRED === 'true',
      rejectUnauthorized: process.env.SSL_REJECT_UNAUTHORIZED === 'true'
    }
  } else {
    return false
  }
}

module.exports = new Sequelize(process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: ssl_config(),
    },
  });