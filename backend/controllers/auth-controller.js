// backend/controllers/auth-controller.js
const User = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');

module.exports = {
  register: async (req, res, next) => {
    try {
      const { email, password, username, firstName, lastName } = req.body;

      // Validation basique
      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      // Vérifier si l'email existe déjà
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Un utilisateur avec cet email existe déjà' 
        });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur
      const user = await User.create({
        email,
        password: hashedPassword,
        username: username || email.split('@')[0], // Si pas de username, utilise la partie avant @
        firstName: firstName || null,
        lastName: lastName || null,
        role: 'USER' // Note : majuscules comme dans ton middleware
      });

      // Générer le token JWT
      const token = jwt.generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Retourner les infos utilisateur (sans mot de passe)
      const userResponse = user.toJSON ? user.toJSON() : user;
      delete userResponse.password;

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: userResponse,
        token
      });

    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      // Trouver l'utilisateur par email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ 
          error: 'Email ou mot de passe incorrect' 
        });
      }

      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: 'Email ou mot de passe incorrect' 
        });
      }

      // Générer le token JWT
      const token = jwt.generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Retourner les infos utilisateur (sans mot de passe)
      const userResponse = user.toJSON ? user.toJSON() : user;
      delete userResponse.password;

      res.json({
        message: 'Connexion réussie',
        user: userResponse,
        token
      });

    } catch (error) {
      next(error);
    }
  },

  // GET /auth/me - utilise le middleware requireAuth
  me: async (req, res, next) => {
    try {
      // req.user est déjà défini par le middleware requireAuth
      // Il contient l'utilisateur complet (sans mot de passe)
      res.json({ user: req.user });
    } catch (error) {
      next(error);
    }
  }
};