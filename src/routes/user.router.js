import express from 'express';
import passport from 'passport'; 
import UserDTO from '../dtos/user.dto.js';

const router = express.Router();

const JWTauth = passport.authenticate('jwt', { session: false });

router.get('/current', JWTauth, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ status: 'error', message: 'No user authenticated' });
    }

    const userDTO = new UserDTO(req.user);
    res.status(200).json({ status: 'success', user: userDTO });
});

export default router;