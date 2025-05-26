import TicketModelo from "../models/ticket.model.js"

class TicketManager {
    async createTicket(ticketData) { 
        return await TicketModelo.create(ticketData); 
    }

    async getAllTickets() {
        return await TicketModelo.find().lean();
    }

    async getTicketById(id) {
        return await TicketModelo.findById(id).lean();
    }

    async getTicketByCode(code) {
        return await TicketModelo.findOne({ code: code }).lean();
    }
}

export default new TicketManager();