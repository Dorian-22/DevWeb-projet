// backend/controllers/auth-controller.js
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');

// Fonction pour valider la force du mot de passe
function validatePasswordStrength(password) {
  const errors = [];
  
  if (!password || password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const criteriaMet = [
    hasUpperCase,
    hasLowerCase, 
    hasNumbers,
    hasSpecialChar
  ].filter(Boolean).length;
  
  if (criteriaMet < 3) {
    errors.push('Le mot de passe doit contenir au moins 3 des éléments suivants : majuscule, minuscule, chiffre, caractère spécial');
  }
  
  // Liste des mots de passe communs à éviter
  const commonPasswords = [
    'password', '12345678', 'qwerty123', 'admin123', 'letmein',
    'welcome', 'monkey', 'dragon', 'baseball', 'football',
    'password123', 'adminadmin', 'azerty123', '123456789'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Ce mot de passe est trop commun, veuillez en choisir un autre');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validation de base
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Validation échouée',
          details: ['Email et mot de passe requis']
        });
      }

      // Valider l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Validation échouée',
          details: ['Format email invalide']
        });
      }

      // Valider la force du mot de passe
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          error: 'Mot de passe trop faible',
          details: passwordValidation.errors
        });
      }

      // Vérifier si l'email existe déjà
      const normalizedEmail = email.toLowerCase().trim();
      const existingUser = await User.findOne({ where: { email: normalizedEmail } });
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Validation échouée',
          details: ['Email déjà utilisé']
        });
      }

      // Hasher le mot de passe
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Créer l'utilisateur
      const user = await User.create({
        email: normalizedEmail,
        passwordHash,
        firstName: firstName?.trim() || null,
        lastName: lastName?.trim() || null,
        role: 'USER'
      });

      // Générer le token JWT
      const token = jwt.signPayload({
        id: user.id,
        email: user.email,
        role: user.role
      });

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        token
      });

    } catch (error) {
      console.error('Erreur inscription:', error);
      
      // Gestion des erreurs de validation Sequelize
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        return res.status(400).json({
          error: 'Validation échouée',
          details: errors
        });
      }
      
      res.status(500).json({ 
        error: 'Erreur lors de l\'inscription',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email et mot de passe requis' 
        });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const user = await User.scope('withPassword').findOne({ 
        where: { email: normalizedEmail } 
      });
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Identifiants incorrects' 
        });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ 
          error: 'Identifiants incorrects' 
        });
      }

      const token = jwt.signPayload({
        id: user.id,
        email: user.email,
        role: user.role
      });

      const userResponse = user.get({ plain: true });
      delete userResponse.passwordHash;

      res.json({
        message: 'Connexion réussie',
        user: userResponse,
        token
      });

    } catch (error) {
      console.error('Erreur connexion:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la connexion',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  me: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Non authentifié' });
      }

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({ user });
    } catch (error) {
      console.error('Erreur récupération profil:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};