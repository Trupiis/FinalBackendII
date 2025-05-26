import passport from 'passport';

export const isAuth = passport.authenticate('jwt', { session: false });

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ status: 'error', message: 'Rol insuficiente' });
};

export {
    isAdmin
};