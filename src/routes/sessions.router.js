import { Router } from "express";
import { UsusarioMongoManager } from "../dao/manager/usuariosMongoManager.js";
import { createHash, validaPassword } from "../utils/auth.js";
import jwt from "jsonwebtoken"
import passport from "passport";
import { config } from "../config/config.js";

const router = Router();

router.post("/registro", passport.authenticate("Registro", {}), (req, res) => {
    try {
        res.status(200).json({message: "Usuario registrado", usuarioRegistrado: req.user})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.post("/login", passport.authenticate("Login", {}), (req, res) => {
    let token = jwt.sign(
        {
            id: req.user._id,
            email: req.user.email,
            rol: req.user.rol
        },
        config.SECRET_KEY,
        { expiresIn: 60 * 5 }
    );

     res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 5 * 1000
    });

    console.log(req.user)
    console.log(Object.keys(req.user))

    res.status(200).json({message:"Login exitoso", usuarioLogueado: req.user, token})
})

router.get("/current", passport.authenticate("current", { session: false }), (req, res) => {
    const user = req.user.toObject ? req.user.toObject() : { ...req.user };
    delete user.password;
    res.json({ user });
});


export default router