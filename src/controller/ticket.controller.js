import ticketService from '../services/ticket.service.js';
import TicketDTO from '../dtos/ticket.dto.js';

export const getTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getAllTickets();
    const ticketDTOs = tickets.map(ticket => new TicketDTO(ticket));
    res.json({ status: 'success', tickets: ticketDTOs });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { buyer, products, amount } = req.body;

    if (!buyer || !products || !amount) {
      return res.status(400).json({ status: 'error', message: 'Faltan datos obligatorios' });
    }

    const code = `TICKET-${Date.now()}`;

    const ticketData = {
      code,
      buyer,
      products,
      amount,
      buy_datetime: new Date()
    };

    const ticketCreated = await ticketService.createTicket(ticketData);

    res.status(201).json({ status: 'success', ticket: new TicketDTO(ticketCreated) });
    
  } catch (error) {
    console.error('Error al crear ticket:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getTicketByCode = async (req, res) => {
  try {
    const ticket = await ticketService.getTicketByCode(req.params.code);
    if (!ticket) {
      return res.status(404).json({ status: 'error', message: 'Ticket no encontrado por código' });
    }

    if (ticket.buyer !== req.user.email && req.user.role !== 'admin') {
  return res.status(403).json({ status: 'error', message: 'Acceso denegado al ticket' });
}

    res.json({ status: 'success', ticket: new TicketDTO(ticket) });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.tid);
    if (!ticket) {
      return res.status(404).json({ status: 'error', message: 'Ticket no encontrado' });
    }

    console.log('Usuario logueado:', req.user.email, 'Rol:', req.user.role);
    console.log('Comprador ticket:', ticket.buyer);

    if (ticket.buyer.toLowerCase() !== req.user.email.toLowerCase() && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Acceso denegado al ticket' });
    }

    res.json({ status: 'success', ticket: new TicketDTO(ticket) });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

