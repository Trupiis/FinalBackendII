import mongoose from "mongoose";

export const UsuariosModelo = mongoose.model('users', new mongoose.Schema({
    first_name: { type: String},
    last_name: { type: String},
    email:{type: String, unique: true, require: true},
    age: { type: Number},
    password: {type: String, require: true},
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts' 
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
   },
   {
       timestamps: true,
       strict: false
}
))
