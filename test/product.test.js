import * as chai from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const expect = chai.expect;
const requester = supertest(app);

describe('Test de endpoints de productos', () => {
  let productId = '';
  let adminToken = '';

  before(() => {
    const payload = {
      sub: '6836feca1aa9013fab2ba033',
      email: 'Melina@example.com',
      role: 'admin'
    };
    adminToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
  });


  it('Debe obtener todos los productos', async () => {
    const res = await requester.get('/api/products');


    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('payload');
    expect(res.body.payload).to.be.an('array');
  });

  it('Debe crear un nuevo producto (admin)', async () => {
  
    const randomCode = `TESTCODE_${Date.now()}`; // o un UUID corto

const res = await requester.post('/api/products')
  .set('Authorization', `Bearer ${adminToken}`)
  .send({
    title: "Producto Test",
    description: "Descripción de prueba",
    price: 99.99,
    stock: 5,
    code: randomCode,
    category: "Test",
    status: true
  });

  expect(res.status).to.equal(201);
  
  productId = res.body.product._id;
if (!productId) throw new Error("No se recibió productId tras creación");


  if (!productId) {
    throw new Error("No se recibió productId después de crear el producto");
  }
});


  it('Debe obtener el producto por su ID', async () => {
  const res = await requester.get(`/api/products/${productId}`)

  expect(res.status).to.equal(200)
  expect(res.body).to.have.property('product')
  expect(res.body.product).to.be.an('object')
  expect(res.body.product._id).to.equal(productId)
})


  it('Debe actualizar el producto (admin)', async () => {
    const res = await requester.put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: "Producto Test Actualizado",
        price: 120
      })

    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('object')
  })

  it('Debe eliminar el producto (admin)', async () => {
    const res = await requester.delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('object')
  })

})
