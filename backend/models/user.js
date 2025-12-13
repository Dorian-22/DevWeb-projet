// backend/models/user.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      set(value) {
        this.setDataValue('email', value.trim().toLowerCase());
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash' 
    },
    role: {
      type: DataTypes.ENUM('USER', 'ADMIN'),
      allowNull: false,
      defaultValue: 'USER'
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'last_name'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true, 
    defaultScope: {
      attributes: { exclude: ['passwordHash'] }
    }
  });

  User.addScope('withPassword', {
    attributes: { include: ['passwordHash'] }
  });

  return User;
};