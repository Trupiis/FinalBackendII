import passport from "passport";
import local from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UsusarioMongoManager } from "../dao/manager/usuariosMongoManager.js";
import { createHash, validaPassword } from "../utils/auth.js"
import { config } from "./config.js";


const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
};

export const initPassport = () =>{
    passport.use("Registro", new local.Strategy(
        {usernameField: "email", passReqToCallback: true},
        async (req, username, password, done) => {
            try {
                const {nombre, apellido} = req.body

                if(!nombre || !apellido){
                    console.log("Algun campo invalido o faltante")
                    return done(null, false)
                }

                const userManager = new UsusarioMongoManager();
                let exist = await UsusarioMongoManager.getUserByEmail(username)
                if (exist) {
                    return done(null, false);
            }

                const newUser = {
                    nombre,
                    apellido,
                    email: username,
                    password: createHash(password)
                }

                const user = await UsusarioMongoManager.createUser(newUser);
                delete user.password;

                return done(null, user)

            } catch (error) {
                console.error("Error en estrategia Registro:", error);
                return done(error);
}
        }
    ))


    passport.use("Login", new local.Strategy(
        {usernameField: "email"},
        async (username, password, done) => {
            try {
                const userManager = new UsusarioMongoManager();
                const user = await UsusarioMongoManager.getUserByEmail(username);
                if (!user) {
                    return done(null, false);
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



    passport.serializeUser((user, done) => {
    done(null, user._id); 
    });

passport.deserializeUser(async (id, done) => {
    try {
        const userManager = new UsusarioMongoManager();
        const user = await UsusarioMongoManager.getUserById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});


passport.use("current", new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: config.SECRET_KEY,
}, async(jwt_payload, done) => {
    try{
        const userManager = new UsusarioMongoManager();
        const user = await UsusarioMongoManager.getUserById(jwt_payload.id);
        
        if(!user){
            return done(null, false);
        }
        return done(null, user)
    }catch(error){
        return done(error);
    }
}))

}