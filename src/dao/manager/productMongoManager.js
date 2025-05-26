import { ProductosModelo } from "../models/Product.model";

class ProductManager {
    async getProducts(filter = {}, options = {}) {
        return await Product.paginate(filter, options);
    }

    async getProductById(id) {
        return await Product.findById(id);
    }

    async addProduct(productData) {
        return await Product.create(productData);
    }

    async updateProduct(id, productData) {
        return await Product.findByIdAndUpdate(id, productData, { new: true });
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }

    async updateStock(id, quantityChange) {
        return await Product.findByIdAndUpdate(id, { $inc: { stock: quantityChange } }, { new: true });
    }
}

export default new ProductManager();