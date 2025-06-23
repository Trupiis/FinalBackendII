import { Router } from "express";
import jwt from "jsonwebtoken"
import passport from "passport";
import { config } from "../config/config.js";
import {login, register, current, logout} from "../controller/session.controller.js"
import UserDTO from "../dtos/user.dto.js";

const router = Router();


/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve token o redirección
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", login)

/**
 * @swagger
 * /api/sessions/registro:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registro exitoso
 *       400:
 *         description: Error en el registro
 */
router.post("/registro", register)

/**
 * @swagger
 * /api/sessions/registro:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registro exitoso
 *       400:
 *         description: Error en el registro
 */
router.get('/current',
    (req, res, next) => {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
          console.error('Passport error:', err);
          return res.status(500).json({ status: 'error', message: 'Error interno en Passport', error: err.message });
        }
        if (!user) {
          console.warn('No se encontró usuario con el token. Info:', info);
          return res.status(401).json({ status: 'unauthorized', message: 'Token inválido o expirado', info });
        }
        req.user = user;
        next();
      })(req, res, next);
    },
    (req, res) => {
      const dto = new UserDTO(req.user);
      res.json({ status: 'success', payload: dto });
    }
  );
  

  /**
 * @swagger
 * /api/sessions/logout:
 *   get:
 *     summary: Cierra sesión de usuario
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */
router.get("/logout", logout)
export default router