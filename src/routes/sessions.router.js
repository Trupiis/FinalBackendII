import { Router } from "express";
import jwt from "jsonwebtoken"
import passport from "passport";
import { config } from "../config/config.js";
import {login, register, current, logout} from "../controller/session.controller.js"
import UserDTO from "../dtos/user.dto.js";

const router = Router();

router.post("/login", login)

router.post("/registro", register)

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
  

router.get("/logout", logout)
export default router