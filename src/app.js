import dotenv from "dotenv"
import path from "path"
import __dirname from "./config/utils.js"
import { config } from "./config/config.js"
import { initPassport } from "./config/passport.config.js"
dotenv.config({path: path.resolve(__dirname, "../.env")})
import express from "express"
import handlebars from "express-handlebars"
import mongoose from "mongoose"
import sessions from "express-session"
import methodOverride from 'method-override';
import MongoStore from "connect-mongo"
import cookieParser from "cookie-parser"
import passport from "passport"

//Import routers
import sessionsRouter from "./routes/sessions.router.js"
import cartsRouter from "./routes/cart.router.js"
import productsRouter from "./routes/product.router.js"
import ticketsRouter from "./routes/ticket.router.js"
import usersRouter from "./routes/user.router.js"

//Iniciar SV
const app = express()
const PORT = process.env.PORT || 8080

console.log("MONGO_URL:", process.env.MONGO_URL);

app.use(sessions({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        ttl: 3600
    })
}))

initPassport()

//Middlewares
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use(methodOverride('_method'));


//Routers
app.use("/api/sessions", sessionsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/users", usersRouter)
app.use("/api/tickets", ticketsRouter)
app.use("/api/products", productsRouter)


//MONGODB
const conectar=async()=>{
    try {
        await mongoose.connect(
            process.env.MONGO_URL
        )
        console.log(`Conexión a DB establecida`)
    } catch (error) {
        console.log(`Error al conectarse con el servidor de BD`, error.message)
        process.exit(1);
    }
}

// Iniciar 
conectar().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
});