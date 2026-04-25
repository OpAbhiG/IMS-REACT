const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('asset_management', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

// Test connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connection OK'))
  .catch(err => console.error('❌ Database connection FAILED:', err));

module.exports = sequelize;
