const express = require('express');
const cors = require('cors');

const { testConnection } = require('./lib/db');
const { syncModels } = require('./models');

const eventsRouter = require('./routes/events');
const categoriesRouter = require('./routes/categories');
const locationsRouter = require('./routes/locations');

const adminEventsRouter = require('./routes/admin-events');
const adminCategoriesRouter = require('./routes/admin-categories');
const adminLocationsRouter = require('./routes/admin-locations');

const { requireAuth, requireAdmin } = require('./middlewares/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes publiques
app.use('/events', eventsRouter);
app.use('/categories', categoriesRouter);
app.use('/locations', locationsRouter);

// Routes admin
app.use('/admin/events', requireAuth, requireAdmin, adminEventsRouter);
app.use('/admin/categories', requireAuth, requireAdmin, adminCategoriesRouter);
app.use('/admin/locations', requireAuth, requireAdmin, adminLocationsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'API events OK' });
});

async function start() {
  await testConnection();
  await syncModels();

  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

start();
