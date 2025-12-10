const { Sequelize } = require('sequelize');

const DB_NAME = process.env.DB_NAME || 'eventsdb';
const DB_USER = process.env.DB_USER || 'myuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'mypassword';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false, 
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = {
  sequelize,
  testConnection,
};
