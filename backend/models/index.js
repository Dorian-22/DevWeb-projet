// backend/models/index.js
const { sequelize } = require('../lib/db');

const defineCategory = require('./category');
const defineLocation = require('./location');
const defineEvent = require('./event');
const defineUser = require('./user'); 

const defineRegistration = require('./registration');

// Définition des modèles
const Category = defineCategory(sequelize);
const Location = defineLocation(sequelize);
const Event = defineEvent(sequelize);
const User = defineUser(sequelize);
const Registration = defineRegistration(sequelize);

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

User.hasMany(Event, {
  as: 'createdEvents',
  foreignKey: 'createdBy'
});
Event.belongsTo(User, {
  as: 'createdByUser',
  foreignKey: 'createdBy'
});

async function syncModels() {
  await sequelize.sync({ alter: true }); 
}

// Registration relations
User.hasMany(Registration, { foreignKey: 'userId', as: 'registrations' });
Registration.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Event.hasMany(Registration, { foreignKey: 'eventId', as: 'registrations' });
Registration.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// Many-to-many 
User.belongsToMany(Event, {
  through: Registration,
  foreignKey: 'userId',
  otherKey: 'eventId',
  as: 'registeredEvents',
});

Event.belongsToMany(User, {
  through: Registration,
  foreignKey: 'eventId',
  otherKey: 'userId',
  as: 'registeredUsers',
});


module.exports = {
  sequelize,
  User,
  Category,
  Location,
  Event,
  Registration,
  syncModels,
};