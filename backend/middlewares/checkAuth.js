const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';


module.exports = function checkAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'No token' });
    const token = header.split(' ')[1];
    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user; // { id, email, role }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};