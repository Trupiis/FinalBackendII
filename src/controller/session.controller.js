import passport from "passport"
import jwtUtils from "../utils/jwt.js"
import userService from "../services/user.service.js"


const register = async(req, res, next) =>{

    try{
        const result = await userService.registerUser(req.body)
        res.status(201).json({status: "success", message: "Usuario registrado con certeza", user: result.user})
    }catch (error){
        console.error("Error al registrar a el usuario", error);
        res.status(400).json({status: "error", message: error.message})
    }
}

const login = async(req, res, next) =>{
    try{
        const {email, password} = req.body;

        const result = await userService.loginUser(email, password);

        res.cookie("authToken", result.token,{
            httpOnly: true, 
            maxAge: 60 * 60 * 2000,
            sameSite: "strict"
        })

        res.status(200).json({status: "success", message: "Usuario logueado con exito", user: result.user})
    }catch (error){
        console.error("Error al loguear al usuario", error);
        res.status(500).json({status: "error", message: "Error interno del servidor"})
    }
}

const current = async(req, res, next) => {
    try{
        const token = req.cookies.authToken;

        if(!token){
            return res.status(401).json({status: "error", message: "No hay token de autenticacion"})
        }

        const decoded = jwtUtils.verifyToken(token);
        const userId = decoded.sub;

        const user = await userService.getCurrentUser(userId);

        res.status(200).json({status: "success", message: "Usuario obtenido con exito", user})
    }catch (error){
        console.error("Error al obtener el usuario", error);
        res.status(500).json({status: "error", message: "Error interno del servidor"})
    }
};

const logout = (req, res) => {
    res.clearCookie("authToken", {
    httpOnly: true,
    sameSite: "strict",
    
    });
    res.status(200).json({ status: "success", message: "Usuario deslogueado con éxito" });
};


export{
    register,
    login,
    current,
    logout
}