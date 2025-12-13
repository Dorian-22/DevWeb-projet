// backend/index.js
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./lib/db');
const { syncModels } = require('./models');

// Middlewares
const { requireAuth, requireAdmin } = require('./middlewares/auth');

// Routes
const authRouter = require('./routes/auth');
const eventsRouter = require('./routes/events');
const categoriesRouter = require('./routes/categories'); 
const locationsRouter = require('./routes/locations'); 
const adminEventsRouter = require('./routes/admin-events');
const adminCategoriesRouter = require('./routes/admin-categories');
const adminLocationsRouter = require('./routes/admin-locations');

const registrationsRouter = require('./routes/registrations');
const meRouter = require('./routes/me');
const adminRegistrationsRouter = require('./routes/admin-registrations');


const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Logging amélioré
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes publiques (DOIVENT venir avant les routes admin)
app.use('/auth', authRouter);
app.use('/events', eventsRouter); // Routes GET publiques
app.use('/categories', categoriesRouter); // Routes GET publiques
app.use('/locations', locationsRouter); // Routes GET publiques

// Routes admin PROTÉGÉES
app.use('/admin/events', requireAuth, requireAdmin, adminEventsRouter);
app.use('/admin/categories', requireAuth, requireAdmin, adminCategoriesRouter);
app.use('/admin/locations', requireAuth, requireAdmin, adminLocationsRouter);


app.use('/', registrationsRouter);     // POST /events/:id/register
app.use('/me', meRouter);              // GET /me/registrations

app.use('/admin', requireAuth, requireAdmin, adminRegistrationsRouter);
// => GET /admin/events/:id/registrations

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Events', 
    status: 'OK',
    endpoints: {
      public: {
        events: 'GET /events',
        eventDetails: 'GET /events/:id',
        categories: 'GET /categories',
        locations: 'GET /locations',
        register: 'POST /auth/register',
        login: 'POST /auth/login'
      },
      admin: {
        createEvent: 'POST /admin/events',
        updateEvent: 'PUT /admin/events/:id',
        deleteEvent: 'DELETE /admin/events/:id'
      }
    }
  });
});

// Route health
app.get('/health', async (req, res) => {
  try {
    await testConnection();
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrer le serveur
const PORT = 3000;

async function startServer() {
  try {
    await testConnection();
    await syncModels();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
Backend démarré sur http://localhost:${PORT}

ROUTES PUBLIQUES:
   GET    /events           - Liste des événements
   GET    /events/:id       - Détail d'un événement
   GET    /categories       - Liste des catégories
   GET    /locations        - Liste des lieux
   POST   /auth/register    - Inscription
   POST   /auth/login       - Connexion
   GET    /auth/me          - Profil (authentifié)

ROUTES ADMIN (protégées):
   POST   /admin/events     - Créer un événement
   PUT    /admin/events/:id - Modifier un événement
   DELETE /admin/events/:id - Supprimer un événement
   POST   /admin/categories - Créer une catégorie
   PUT    /admin/categories/:id - Modifier une catégorie
   DELETE /admin/categories/:id - Supprimer une catégorie
   POST   /admin/locations  - Créer un lieu
   PUT    /admin/locations/:id  - Modifier un lieu
   DELETE /admin/locations/:id  - Supprimer un lieu

TEST: curl http://localhost:${PORT}
HEALTH: curl http://localhost:${PORT}/health
      `);
    });
  } catch (error) {
    console.error(' Erreur démarrage:', error);
    process.exit(1);
  }
}

startServer();