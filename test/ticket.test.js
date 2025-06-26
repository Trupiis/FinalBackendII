import supertest from 'supertest';
import * as chai from 'chai';
import app from '../src/app.js';

const expect = chai.expect;
const requester = supertest(app);

describe('Test de endpoints de tickets', () => {
  let buyerCookie;
  let adminCookie;
  let otherCookie;
  let ticketId;
  let ticketCode;

  before(async () => {
    // Login comprador
    const resBuyer = await requester.post('/api/sessions/login').send({
      email: 'Lauti@example.com',
      password: '321'
    });
    buyerCookie = resBuyer.headers['set-cookie'][0].split(';')[0];

    // Login otro usuario
    const resAdmin = await requester.post('/api/sessions/login').send({
      email: 'Melina@example.com',
      password: '321'
    });
    adminCookie = resAdmin.headers['set-cookie'][0].split(';')[0];

    const resOther = await requester.post('/api/sessions/login').send({
    email: 'Pepe@example.com',
    password: '321'
  });
    otherCookie = resOther.headers['set-cookie'][0].split(';')[0];


    // Crear ticket real en DB con el mail del comprador logueado
    const ticketPayload = {
      buyer: 'Lauti@example.com',
      products: [{ product: '64abc123abc123abc123abc1', quantity: 1 }],
      amount: 100
    };
    const resTicket = await requester
      .post('/api/tickets')
      .set('Cookie', buyerCookie)
      .send(ticketPayload);

    ticketId = resTicket.body.ticket._id || resTicket.body.ticket.id;
    ticketCode = resTicket.body.ticket.code;

  });

  it('Debe obtener ticket por código (comprador)', async () => {
    const res = await requester
      .get(`/api/tickets/by-code/${ticketCode}`)
      .set('Cookie', buyerCookie);
    expect(res.status).to.equal(200);
  });

  it('Admin debe poder acceder al ticket por código', async () => {
    const res = await requester
      .get(`/api/tickets/by-code/${ticketCode}`)
      .set('Cookie', adminCookie);
    expect(res.status).to.equal(200);
  });

  it('Debe rechazar acceso a ticket por código si no es comprador ni admin', async () => {
    const res = await requester
      .get(`/api/tickets/by-code/${ticketCode}`)
      .set('Cookie', otherCookie);
    expect(res.status).to.equal(403);
  });

  it('Admin debe poder acceder al ticket por ID', async () => {
    const res = await requester
      .get(`/api/tickets/${ticketId}`)
      .set('Cookie', adminCookie);
    expect(res.status).to.equal(200);
  });

  it('Debe rechazar acceso a ticket por ID si no es comprador ni admin', async () => {
    const res = await requester
      .get(`/api/tickets/${ticketId}`)
      .set('Cookie', otherCookie);
    expect(res.status).to.equal(403);
  });

});
