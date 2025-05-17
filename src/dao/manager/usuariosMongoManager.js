import { UsuariosModelo } from "../models/user.model.js";

export class UsusarioMongoManager {
    
    static async createUser(user){
        try {
            const newUser = await UsuariosModelo.create(user)
            return newUser
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    static async getUserByEmail(email){
        try {
            const user = await UsuariosModelo.findOne({email})
            return user
        } catch (error) {
            console.error("Error al obtenr el usuario por el Email", error)
            throw error
        }
    }

    static async getUserById(id){
        try {
            const user = await UsuariosModelo.findById(id)
            return user
        } catch (error) {
            console.error("Error al obtener el usuario por el ID", error)
            throw error
        }
    }

}