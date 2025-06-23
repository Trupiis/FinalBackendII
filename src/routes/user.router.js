import express from 'express';
import passport from 'passport'; 
import UserDTO from '../dtos/user.dto.js';

const router = express.Router();

const JWTauth = passport.authenticate('jwt', { session: false });


/**
 * @swagger
 * /api/users/current:
 *   get:
 *     summary: Devuelve los datos del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: No hay usuario autenticado o token inválido
 */
router.get('/current', JWTauth, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ status: 'error', message: 'No user authenticated' });
    }

    const userDTO = new UserDTO(req.user);
    res.status(200).json({ status: 'success', user: userDTO });
});

export default router;