import ticketRepository from "../repositories/ticket.repository.js";

class TicketService {
    async createTicket(ticketData) {
        return await ticketRepository.create(ticketData);
    }

    async getAllTickets() {
        return await ticketRepository.getAll();
    }

    async getTicketById(ticketId) {
        return await ticketRepository.findById(ticketId);
    }

    async getTicketByCode(ticketCode) {
        return await ticketRepository.findByCode(ticketCode);
    }
}

export default new TicketService();
