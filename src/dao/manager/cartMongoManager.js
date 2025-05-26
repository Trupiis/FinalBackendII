import CartModelo from "../models/cart.model.js"

class CartManager {
    async createCart(cartData) {
        return await CartModelo.create(cartData);
    }

    async getCartById(id) {
        return await CartModelo.findById(id).populate('products.product');
    }

    async addProductToCart(cid, pid, quantity) {
        const cart = await CartModelo.findById(cid);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        return cart;
    }

    async updateCart(cid, products) {
        return await CartModelo.findByIdAndUpdate(cid, { products }, { new: true }).populate('products.product');
    }

    async updateProductQuantity(cid, pid, quantity) {
        const cart = await CartModelo.findById(cid);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return cart;
        }
        return null;
    }

    async deleteProductFromCart(cid, pid) {
        const cart = await CartModelo.findById(cid);
        if (!cart) return null;

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();
        return cart;
    }

    async deleteCart(cid) {
        return await CartModelo.findById(cid);
        if (!cart) return null;

        cart.products = [];
        await cart.save();
        return cart;
    }

    async getAllCarts() {
        return await CartModelo.find().populate('products.product').lean();
    }
}

export default new CartManager();