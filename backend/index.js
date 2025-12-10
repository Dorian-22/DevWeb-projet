const express = require('express');
const cors = require('cors');

const { testConnection } = require('./lib/db');
const { syncModels } = require('./models');

const eventsRouter = require('./routes/events');
const categoriesRouter = require('./routes/categories');
const locationsRouter = require('./routes/locations');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/events', eventsRouter);
app.use('/categories', categoriesRouter);
app.use('/locations', locationsRouter);

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
