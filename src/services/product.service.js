import mongoose from "mongoose";
import ProductRepository from "../repositories/product.repository.js";

class ProductService {
    async getProducts(filter, options) {
        return await ProductRepository.model.paginate(filter, options);
    }

    async getProductById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('ID Inválido');
            error.statusCode = 400;
            throw error;
        }
        const product = await ProductRepository.findById(id);
        if (!product) {
            const error = new Error('El producto no se encontró');
            error.statusCode = 404;
            throw error;
        }
        return product;
    }

    async addProduct(productData) {
        if (typeof productData.price !== 'number' || productData.price <= 0) {

            const error = new Error('El precio es incorrecto');
            error.statusCode = 400;
            throw error;
        }

        if (typeof productData.stock !== 'number' || productData.stock < 0) {
            const error = new Error('El stock es incorrecto');
            error.statusCode = 400;
            throw error;
        }
        const existingProduct = await ProductRepository.model.findOne({ code: productData.code });
        if (existingProduct) {
            const error = new Error('Ya existe producto con ese ID');
            error.statusCode = 400;
            throw error;
        }
        return await ProductRepository.create(productData);
    }

    async updateProduct(id, productData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('ID Inválido');
            error.statusCode = 400;
            throw error;
        }
        const product = await ProductRepository.findById(id);
        if (!product) {
            const error = new Error('El producto no se encontró');
            error.statusCode = 404;
            throw error;
        }
        if (productData.code) {
            const existingProduct = await ProductRepository.model.findOne({ code: productData.code });
            if (existingProduct && existingProduct._id.toString() !== id) {
                const error = new Error('Ya existe producto con ese ID');
                error.statusCode = 400;
                throw error;
            }
        }
         if (productData.price && (typeof productData.price !== 'number' || productData.price <= 0)) {
                const error = new Error('El precio es incorrecto');
                error.statusCode = 400;
                throw error;
        }
        if (productData.stock && (typeof productData.stock !== 'number' || productData.stock < 0)) {
                const error = new Error('El Stock es incorrecto');
                error.statusCode = 400;
                throw error;
        }
        return await ProductRepository.update(id, productData);
    }

    async deleteProduct(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
                const error = new Error('El ID es Inválido');
                error.statusCode = 400;
                throw error;        }
        const product = await ProductRepository.findById(id);
        if (!product) {
                const error = new Error('El producto no se encontró');
                error.statusCode = 404;
                throw error;
        }
        return await ProductRepository.delete(id);
    }

    async updateProductStock(id, quantityChange) {
        const product = await ProductRepository.findById(id);
         if (!product) {
                const error = new Error('El producto no se encontró');
                error.statusCode = 400;
                throw error;
        }
        product.stock += quantityChange;
        return await ProductRepository.update(id, { stock: product.stock });
    }
}

export default new ProductService();