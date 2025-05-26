import { ProductosModelo } from "../dao/models/product.model.js";

class ProductRepository {
    constructor (ProductosModelo) {
        this.model = ProductosModelo
    }

    async create(data) {
    return this.model.create(data);
    }

    async findById(id) {
    return this.model.findById(id);
    }

    async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
    return this.model.findByIdAndDelete(id);
    }
}

export default new ProductRepository(ProductosModelo);