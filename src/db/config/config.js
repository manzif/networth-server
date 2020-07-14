const dotenv = require('dotenv');

dotenv.config();

const config = {
  development: {
    username: "postgres",
    password: "password",
    database: "networth",
    host: "127.0.0.1",
    dialect: 'postgres',
    operatorsAliases: false,
  },
  test: {
    username: process.env.db_username_test,
    password: process.env.db_password_test,
    database: 'ah_db_test',
    host: 'localhost',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    operatorsAliases: false
  }
};

module.exports = config;