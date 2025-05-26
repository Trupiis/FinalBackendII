import mongoose, { mongo } from "mongoose";

export const TicketModelo = mongoose.model("tickets", new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    buy_datetime: {
        type: Date,
        default: Date.now,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    buyer: {
        type: String,
        required: true
    },
    products: [ 
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }
    ]
}));