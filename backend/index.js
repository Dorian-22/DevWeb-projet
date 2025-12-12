// backend/index.js
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./lib/db');
const { syncModels } = require('./models');

// Middlewares
const { requireAuth, requireAdmin } = require('./middlewares/auth');

// Routes
const authRouter = require('./routes/auth');
const adminEventsRouter = require('./routes/admin-events');
const adminCategoriesRouter = require('./routes/admin-categories');
const adminLocationsRouter = require('./routes/admin-locations');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes publiques
app.use('/auth', authRouter);

// Routes admin PROTÉGÉES
app.use('/admin/events', requireAuth, requireAdmin, adminEventsRouter);
app.use('/admin/categories', requireAuth, requireAdmin, adminCategoriesRouter);
app.use('/admin/locations', requireAuth, requireAdmin, adminLocationsRouter);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Events', status: 'OK' });
});

// Route health
app.get('/health', async (req, res) => {
  try {
    await testConnection();
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'Database connection failed', error: error.message });
  }
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Démarrer le serveur
const PORT = 3000;

async function startServer() {
  try {
    await testConnection();
    await syncModels();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur démarrage:', error);
  }
}

startServer();