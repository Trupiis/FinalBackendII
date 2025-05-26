const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ status: 'error', message: 'No hay usuarios autenticados' });
        }

        const userRole = req.user.role;

        const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        if (!rolesToCheck.includes(userRole)) {
            return res.status(403).json({ status: 'error', message: 'Rol insuficiente' });
        }

        next();
    };
};

export default authorize;