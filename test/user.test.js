import * as chai from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const expect = chai.expect;
const requester = supertest(app);

describe('Test de endpoints de sesiones', () => {

  let token = '';
  let userEmail = `testuser_${Date.now()}@example.com`;

  it('Debe registrar un nuevo usuario', async () => {
    const res = await requester.post('/api/sessions/registro').send({
      first_name: 'Test',
      last_name: 'User',
      email: userEmail,
      password: 'testpassword'
    });

    expect(res.status).to.equal(201);
  });
let cookie = '';

it('Debe iniciar sesión y devolver un token en cookie', async () => {
  const res = await requester.post('/api/sessions/login').send({
    email: userEmail,
    password: 'testpassword'
  });

  expect(res.status).to.equal(200);

  const cookies = res.headers['set-cookie'];
  expect(cookies).to.exist;

  const authCookie = cookies.find(c => c.startsWith('authToken='));
  expect(authCookie).to.exist;

  cookie = authCookie.split(';')[0]; // GUARDAMOS en la global
});


it('Debe obtener los datos del usuario autenticado', async () => {
  const res = await requester.get('/api/users/current')
    .set('Cookie', cookie);

  expect(res.status).to.equal(200);
  expect(res.body.status).to.equal('success');
});

  it('Debe cerrar sesión', async () => {
    const res = await requester.get('/api/sessions/logout');
    expect(res.status).to.equal(200);
  });

});
