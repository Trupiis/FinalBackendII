import passport from "passport";
import local from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import usuarioMongoManager from "../dao/manager/usuariosMongoManager.js"
import { createHash, validaPassword } from "../utils/auth.js"
import { config } from "./config.js";


const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['authToken'];
  }
  return token;
};

export const initPassport = () =>{
    passport.use("Login", new local.Strategy(
        {usernameField: "email"},
        async (username, password, done) => {

            if(!username || !password){
                console.log("Algun campo invalido o faltante")
                return done(null, false)
            }

            try {
                const user = await usuarioMongoManager.getUserByEmail(username);
                if (!user) {
                    return done(null, false, {message: "Usuario no encontrado"});
                }

                if (!validaPassword(password, user.password)) {
                    return done(null, false);
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ))

    passport.use("Registro", new local.Strategy(
        {
        usernameField: "email", 
        passwordField: "password",
        passReqToCallback: true
    },
        async (req, username, password, done) => {
            try {
                const {nombre, apellido} = req.body

                if(!nombre || !apellido){
                    console.log("Algun campo invalido o faltante")
                    return done(null, false)
                }

                const userManager = new usuarioMongoManager();
                let exist = await usuarioMongoManager.getUserByEmail(username)
                if (exist) {
                    return done(null, false);
            }

                const newUser = {
                    nombre,
                    apellido,
                    email: username,
                    password: createHash(password)
                }

                const user = await usuarioMongoManager.createUser(newUser);
                delete user.password;

                return done(null, user)

            } catch (error) {
                console.error("Error en estrategia Registro:", error);
                return done(error);
}
        }
    ))


    passport.serializeUser((user, done) => {
    done(null, user._id); 
    });

passport.deserializeUser(async (id, done) => {
    try {
        const userManager = new usuarioMongoManager();
        const user = await usuarioMongoManager.getUserById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});


passport.use("jwt", new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: config.SECRET_KEY,
}, async(jwt_payload, done) => {
    try{
        const user = await usuarioMongoManager.getUserById(jwt_payload.sub);
        
        if(!user){
            return done(null, false);
        }
        return done(null, user)
    }catch(error){
        return done(error);
    }
}))

}