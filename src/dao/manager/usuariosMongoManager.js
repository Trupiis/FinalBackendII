import { UsuariosModelo } from "../models/user.model.js";

class UsuarioMongoManager {
    
    async createUser(userData){
        try {
            const newUser = await UsuariosModelo.create(userData)
            return newUser
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getUserByEmail(email){
        try {
            const user = await UsuariosModelo.findOne({email})
            return user
        } catch (error) {
            console.error("Error al obtenr el usuario por el Email", error)
            throw error
        }
    }

    async getUserById(id){
        try {
            const user = await UsuariosModelo.findById(id)
            return user
        } catch (error) {
            console.error("Error al obtener el usuario por el ID", error)
            throw error
        }
    }

}

const usuariosMongoManager = new UsuarioMongoManager();

export default usuariosMongoManager;

