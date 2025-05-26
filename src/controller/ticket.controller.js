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

    const newTicketData = req.body; 

    const simulatedTicket = {
      ...newTicketData,
      code: `TICKET-${Date.now()}`,
      purchase_datetime: new Date(),
    };

    res.status(201).json({ status: 'success', message: 'Ticket creado (simulado)', ticket: new TicketDTO(simulatedTicket) });

  } catch (error) {
    console.error('Error al crear ticket:', error);
    res.status(500).json({ status: 'error', message: 'Error interno al crear el ticket: ' + error.message });
  }
};

export const getTicketByCode = async (req, res) => {
  try {
    const ticket = await ticketService.getTicketByCode(req.params.code);
    if (!ticket) {
      return res.status(404).json({ status: 'error', message: 'Ticket no encontrado por código' });
    }

    if (ticket.purchaser !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Acceso denegado al ticket por código' });
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

    if (ticket.purchaser !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Acceso denegado al ticket' });
    }

    res.json({ status: 'success', ticket: new TicketDTO(ticket) });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};