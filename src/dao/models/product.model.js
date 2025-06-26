import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

export const ProductosModelo = mongoose.model("product", new mongoose.Schema({
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, default: true }
})
    .plugin(mongoosePaginate)
)

export default ProductosModelo;
