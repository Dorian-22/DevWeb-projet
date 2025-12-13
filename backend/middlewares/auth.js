// backend/middlewares/auth.js
const jwt = require('../lib/jwt');
const { User } = require('../models');

async function requireAuth(req, res, next) {
  try {
    console.log('Vérification auth...');
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Pas de token Bearer');
      return res.status(401).json({ error: 'Token manquant ou invalide' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verifyToken(token);

    if (!decoded || !decoded.id) {
      console.log('Token invalide ou expiré');
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.log(`User ID ${decoded.id} non trouvé en DB`);
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    console.log(`User authentifié: ${user.email} (ID: ${user.id}, Role: ${user.role})`);
    req.user = user;
    next();

  } catch (error) {
    console.error('Erreur auth middleware:', error);
    res.status(401).json({ error: 'Erreur d\'authentification' });
  }
}

function requireAdmin(req, res, next) {
  console.log(`Vérification admin pour user: ${req.user?.email}`);
  if (!req.user || req.user.role !== 'ADMIN') {
    console.log(`Accès refusé: ${req.user?.email} n'est pas ADMIN`);
    return res.status(403).json({ error: 'Admin access required' });
  }
  console.log(`User ${req.user.email} est ADMIN`);
  next();
}

module.exports = {
  requireAuth,
  requireAdmin
};