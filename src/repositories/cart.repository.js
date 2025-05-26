import {CartModelo} from "../dao/models/cart.model.js"

class CartRepository {
    constructor(CartModelo){
        this.model = CartModelo;
    }

    async create(data){
        return await this.model.create(data);
    }

    async findById(id){
        return await this.model.findById(id);
    }

    async update(id, data){
        return await this.model.findByIdAndUpdate(id, data, {new: true});
    }

    async delete(id){
        return await this.model.findByIdAndDelete(id);
    }
}

export default new CartRepository(CartModelo);