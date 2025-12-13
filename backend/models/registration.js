// backend/models/registration.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Registration = sequelize.define(
    'Registration',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },

      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'event_id',
      },

      status: {
        type: DataTypes.ENUM('REGISTERED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'REGISTERED',
      },
    },
    {
      tableName: 'registrations',
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'event_id'], // empêche les doublons en DB
        },
      ],
    }
  );

  return Registration;
};
