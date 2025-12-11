// middlewares/auth.js

//  Version temporaire pour 
// à remplacer par une vraie vérification JWT + recherche user en DB

function requireAuth(req, res, next) {
  // Exemple de ce qu'il faudra faire :
  // - lire le token (Authorization: Bearer xxx)
  // - vérifier le token
  // - mettre le user décodé dans req.user
  // Pour l'instant, on simule un user connecté :
  req.user = {
    id: 1,
    role: 'ADMIN', // change en 'USER' pour tester les refus
  };
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
};
