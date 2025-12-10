module.exports = function checkRole(role) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'No user' });
        if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
        next();
    };
};