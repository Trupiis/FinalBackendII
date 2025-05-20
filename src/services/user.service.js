import bcrypt from "bcrypt"
import userRepository from "../repositories/user.repository.js"
//CART REPOSITORY
import jwtUtils from "../utils/jwt.js"

class UserService{
    async register(userData){
        const {email, password, first_name, last_name} = userData;

        if(!email || !password || !first_name || !last_name){
            throw new Error("Todos los campos son obligatorios")
        }

        const existingUser = await userRepository.model.findOne({email});

        if(existingUser){
            throw new Error("El usuario ya existe")
        }

        const hashedPassword = await bcrypt.hashSync(password, 10);
        //AGREGAR CART REPOSITORY


        const newUser = await userRepository.create({
            ...userData,
            password: hashedPassword,
        
        })

        return {user: this.getUserDTO(newUser)}
        }

        async loginUser(email, password){
            const user = await userRepository.model.findOne({email});

            if(!user){
                throw new Error("Usuario no encontrado")
            }

            const exist = bcrypt.compareSync(password, user.password);

            if(!exist){
                throw new Error("Contraseña incorrecta")
            }

            const token = jwtUtils.generateToken(user);
            return {token, user: this.getUserDTO(user)}
        }

        async getCurrentUser (userId){
            const user = await userRepository.findById(userId);
            if(!user){
                throw new Error("Usuario no encontrado")
            }

            return this.getUserDTO(user)
        }

        async updateUser(userId, userData){
            if(userData.password){
                userData.password = bcrypt.hashSync(userData.password, 10)
            }

            const updateUser = await userRepository.update(userId, userData);
            return this.getUserDTO(updatedUser)
        }

        async deleteUser(userId) {
            return await userRepository.delete(userId);
        }

        async getAllUsers() {
            const users = await userRepository.model.find();
            return users.map(user => this.getUserDTO(user));
        }

        generateToken(user) {
            return jwtUtils.generateToken(user);
        }

        getUserDTO(user) {
            return {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role,
                cart: user.cart
            };
        }
}

export default new UserService();