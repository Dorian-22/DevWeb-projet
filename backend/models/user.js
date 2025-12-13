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
      unique: {
        name: 'users_email_unique',
        msg: 'Cet email est déjà utilisé'
      },
      validate: {
        isEmail: {
          msg: 'Format email invalide'
        },
        notEmpty: {
          msg: 'L\'email est requis'
        }
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
      validate: {
        notEmpty: {
          msg: 'Le mot de passe est requis'
        },
        isStrongPassword(value) {
          if (typeof value !== 'string') {
            throw new Error('Le mot de passe doit être une chaîne de caractères');
          }
          
          // Vérifier la longueur
          if (value.length < 8) {
            throw new Error('Le mot de passe doit contenir au moins 8 caractères');
          }
          
          // Vérifier les critères de force
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumbers = /\d/.test(value);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
          
          const criteriaMet = [
            hasUpperCase,
            hasLowerCase, 
            hasNumbers,
            hasSpecialChar
          ].filter(Boolean).length;
          
          if (criteriaMet < 3) {
            throw new Error('Le mot de passe doit contenir au moins 3 des éléments suivants : majuscule, minuscule, chiffre, caractère spécial');
          }
        }
      }
    },
    role: {
      type: DataTypes.ENUM('USER', 'ADMIN'),
      defaultValue: 'USER',
      validate: {
        isIn: {
          args: [['USER', 'ADMIN']],
          msg: 'Le rôle doit être USER ou ADMIN'
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'first_name',
      validate: {
        len: {
          args: [0, 50],
          msg: 'Le prénom ne peut pas dépasser 50 caractères'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'last_name',
      validate: {
        len: {
          args: [0, 50],
          msg: 'Le nom ne peut pas dépasser 50 caractères'
        }
      }
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    defaultScope: {
      attributes: { exclude: ['password_hash'] }
    },
    hooks: {
      beforeValidate: (user) => {
        // Normaliser l'email en minuscules
        if (user.email && typeof user.email === 'string') {
          user.email = user.email.toLowerCase().trim();
        }
      },
      beforeCreate: async (user) => {
        // S'assurer que le mot de passe n'est pas en clair
        // (le hash sera fait dans le controller avant)
        if (user.passwordHash && !user.passwordHash.startsWith('$2')) {
          console.warn('⚠️  Attention: Le mot de passe semble ne pas être hashé avant enregistrement');
        }
      }
    }
  });

  User.addScope('withPassword', {
    attributes: { include: ['password_hash'] }
  });

  // Méthode d'instance pour vérifier le mot de passe
  User.prototype.isPasswordStrong = function(password) {
    if (!password || password.length < 8) return false;
    
    const criteria = [
      /[A-Z]/.test(password), // Majuscule
      /[a-z]/.test(password), // Minuscule  
      /\d/.test(password),    // Chiffre
      /[!@#$%^&*(),.?":{}|<>]/.test(password) // Spécial
    ];
    
    return criteria.filter(Boolean).length >= 3;
  };

  return User;
};