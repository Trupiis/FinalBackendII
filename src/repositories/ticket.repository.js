import { TicketModelo } from "../dao/models/ticket.model.js";

class TicketRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        return this.model.create(data);
    }

    async findById(id) {
        return this.model.findById(id);
    }

    async findByCode(code) {
        return this.model.findOne({ code });
    }

    async getAll() {
        return this.model.find();
    }

    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
}

export default new TicketRepository(TicketModelo);
