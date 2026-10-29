const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'asset_management',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connection OK'))
  .catch(err => console.error('❌ Database connection FAILED:', err));

module.exports = sequelize;
