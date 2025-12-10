const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

//pour admin 
const checkAuth = require('./middlewares/checkAuth');
const checkRole = require('./middlewares/checkRole');


app.get('/admin/dashboard', checkAuth, checkRole('ADMIN'), (req, res) => {
    res.json({ message: 'Bienvenue admin' });
});