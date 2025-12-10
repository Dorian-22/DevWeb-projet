const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // adapte selon ton index-models


const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';


module.exports = {
    async register(req, res) {
        try {
            const { email, password, role } = req.body;
            if (!email || !password) return res.status(400).json({ error: 'Email et password requis' });


            const exists = await User.findOne({ where: { email } });
            if (exists) return res.status(400).json({ error: 'Email déjà utilisé' });


            const hashed = await bcrypt.hash(password, 10);
            const user = await User.create({ email, password: hashed, role: role || 'USER' });


            return res.json({ id: user.id, email: user.email, role: user.role });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    },


    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(400).json({ error: 'Identifiants invalides' });


            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(400).json({ error: 'Identifiants invalides' });


            const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });


            return res.json({ token });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    },


    async me(req, res) {
        try {
            const auth = req.headers.authorization;
            if (!auth) return res.status(401).json({ error: 'No token' });


            const token = auth.split(' ')[1];
            const payload = jwt.verify(token, JWT_SECRET);


            const user = await User.findByPk(payload.id, { attributes: ['id', 'email', 'role'] });
            return res.json(user);
        } catch (err) {
            console.error(err);
            return res.status(401).json({ error: 'Token invalide' });
        }
    }
};