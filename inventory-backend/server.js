require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const assetRoutes = require('./routes/assetRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/uploads', express.static('uploads'));
app.use('/api/assets', assetRoutes);

// Health check
app.get('/', (req, res) => res.send({ status: 'ok', message: 'Inventory backend running' }));

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection OK');

    // Sync models
    await sequelize.sync();
    console.log('✅ Models synced');

    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
}

start();
