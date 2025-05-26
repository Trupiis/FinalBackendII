import mongoose from "mongoose"

export const CartModelo = mongoose.model('carts', new mongoose.Schema({
    products: [
        {
            product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
            quantity: {type: Number, require: true, default: 1}
        }
    ]
},
{timestamps: true})
);