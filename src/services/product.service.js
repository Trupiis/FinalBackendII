import mongoose from "mongoose";
import ProductRepository from "../repositories/product.repository.js";

class ProductService {
    async getProducts(filter, options) {
        return await ProductRepository.model.paginate(filter, options);
    }

    async getProductById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError('ID inválido', 400);
        }
        const product = await ProductRepository.findById(id);
        if (!product) {
            throw new ApiError('No se encontró el producto', 404);
        }
        return product;
    }

    async addProduct(productData) {
        if (typeof productData.price !== 'number' || productData.price <= 0) {
            throw new ApiError('El precio no es correcto', 400);
        }
        if (typeof productData.stock !== 'number' || productData.stock < 0) {
            throw new ApiError('El stock no es correcto', 400);
        }
        const existingProduct = await ProductRepository.model.findOne({ code: productData.code });
        if (existingProduct) {
            throw new ApiError('Producto existente', 400);
        }
        return await ProductRepository.create(productData);
    }

    async updateProduct(id, productData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError('ID inválido', 400);
        }
        const product = await ProductRepository.findById(id);
        if (!product) {
            throw new ApiError('Producto no encontrado', 404);
        }
        if (productData.code) {
            const existingProduct = await ProductRepository.model.findOne({ code: productData.code });
            if (existingProduct && existingProduct._id.toString() !== id) {
                throw new ApiError('Código del producto existente', 400);
            }
        }
         if (productData.price && (typeof productData.price !== 'number' || productData.price <= 0)) {
            throw new ApiError('El precio no es correcto', 400);
        }
        if (productData.stock && (typeof productData.stock !== 'number' || productData.stock < 0)) {
            throw new ApiError('El stock no es correcto', 400);
        }
        return await ProductRepository.update(id, productData);
    }

    async deleteProduct(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError('ID inválido', 400);
        }
        const product = await ProductRepository.findById(id);
        if (!product) {
            throw new ApiError('Producto no encontrado', 404);
        }
        return await ProductRepository.delete(id);
    }

    async updateProductStock(id, quantityChange) {
        const product = await ProductRepository.findById(id);
         if (!product) {
            throw new ApiError('Producto no encontrado', 404);
        }
        product.stock += quantityChange;
        return await ProductRepository.update(id, { stock: product.stock });
    }
}

export default new ProductService();