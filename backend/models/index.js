
const { sequelize } = require('../lib/db');

const defineCategory = require('./category');
const defineLocation = require('./location');
const defineEvent = require('./event');

// Définition des modèles
const Category = defineCategory(sequelize);
const Location = defineLocation(sequelize);
const Event = defineEvent(sequelize);

// Associations
Category.hasMany(Event, {
  foreignKey: {
    name: 'categoryId',
    allowNull: false,
    field: 'category_id',
  },
  as: 'events',
});

Event.belongsTo(Category, {
  foreignKey: {
    name: 'categoryId',
    allowNull: false,
    field: 'category_id',
  },
  as: 'category',
});

Location.hasMany(Event, {
  foreignKey: {
    name: 'locationId',
    allowNull: false,
    field: 'location_id',
  },
  as: 'events',
});

Event.belongsTo(Location, {
  foreignKey: {
    name: 'locationId',
    allowNull: false,
    field: 'location_id',
  },
  as: 'location',
});

async function syncModels() {
  await sequelize.sync({ alter: true }); 
}

module.exports = {
  sequelize,
  Category,
  Location,
  Event,
  syncModels,
};
