// backend/middlewares/auth.js
const jwt = require('../lib/jwt');
const User = require('../models/users'); // Pour chercher l'utilisateur en DB

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

    // Optionnel : Chercher l'utilisateur en DB pour vérifier qu'il existe toujours
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] } // Exclure le mot de passe
    });

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    // Ajouter les infos utilisateur à la requête
    req.user = user;
    next();

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(401).json({ error: 'Erreur d\'authentification' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Accès admin requis' });
  }
  next();
}

// Version sans vérification DB (plus rapide mais moins sécurisée)
async function requireAuthLight(req, res, next) {
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

    // Juste décoder le JWT, pas de vérification en DB
    req.user = decoded;
    next();

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(401).json({ error: 'Erreur d\'authentification' });
  }
}

module.exports = {
  requireAuth,        // Avec vérification en DB (plus sécurisé)
  requireAuthLight,   // Sans vérification DB (plus rapide)
  requireAdmin,
};