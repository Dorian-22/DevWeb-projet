// backend/middlewares/auth.js
const jwt = require('../lib/jwt');
const { User } = require('../models');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant ou invalide' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Erreur auth middleware:', error);
    res.status(401).json({ error: 'Erreur d\'authentification' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = {
  requireAuth,
  requireAdmin
};