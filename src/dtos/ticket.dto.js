class TicketDTO {
  constructor(ticket) {
    this.id = ticket._id; 
    this.code = ticket.code;
    this.buy_datetime = ticket.buy_datetime;
    this.amount = ticket.amount;
    this.buyer = ticket.buyer;
    this.products = ticket.products; 
  }
}

export default TicketDTO;