// backend/controllers/auth-controller.js
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email déjà utilisé' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        email,
        passwordHash,
        firstName,
        lastName,
        role: 'USER'
      });

      const token = jwt.signPayload({
        id: user.id,
        email: user.email,
        role: user.role
      });

      const userResponse = user.get({ plain: true });
      delete userResponse.passwordHash;

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: userResponse,
        token
      });

    } catch (error) {
      console.error('Erreur inscription:', error);
      res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      const user = await User.scope('withPassword').findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Identifiants incorrects' });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: 'Identifiants incorrects' });
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
      res.status(500).json({ error: 'Erreur lors de la connexion' });
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