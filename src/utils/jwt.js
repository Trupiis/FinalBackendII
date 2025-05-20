import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
class JwtUtils {
    generateToken(user){
        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role
        }

        return jwt.sign(payload, config.SECRET_KEY, {expiresIn: "1h"})
    }

    verifyToken(token){
        try{
            return jwt.verify(token, config.SECRET_KEY)
        }catch(error){
            throw new Error("Token invalido")
        }
    }
}

const jwtUtils = new JwtUtils()
export default jwtUtils