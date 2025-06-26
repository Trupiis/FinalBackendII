import ProductModel from '../src/dao/models/product.model.js';
import supertest from 'supertest';
import * as chai from 'chai';
import app from '../src/app.js';

const expect = chai.expect;
const requester = supertest(app);

describe('Test de endpoints de carritos', () => {
    let cookie;
    let productId;
    let cartId;

    before(async () => {
        // Login como usuario
        const resLogin = await requester.post('/api/sessions/login').send({
            email: 'Lauti@example.com',
            password: '321'
        });

        cookie = resLogin.headers['set-cookie'][0].split(';')[0];

        // Crear producto directamente en la base (sin pasar por el endpoint)
        const product = await ProductModel.create({
            title: 'Producto de prueba',
            description: 'Test product',
            price: 100,
            stock: 50,
            code: `PTEST-${Date.now()}`,
            category: 'Test'
        });
        productId = product._id.toString();

        // Crear carrito vacío
        const resCart = await requester.post('/api/carts').set('Cookie', cookie).send({ selectedProducts: [] });
        cartId = resCart.body.cartId;
    });

    it('Debe obtener el carrito por su ID', async () => {
        const res = await requester
            .get(`/api/carts/${cartId}`)
            .set('Cookie', cookie);

        expect(res.status).to.equal(200);
        expect(res.body.cart).to.have.property('_id', cartId);
    });

    it('Debe agregar un producto al carrito', async () => {
        const res = await requester
            .post(`/api/carts/${cartId}/products/${productId}`)
            .set('Cookie', cookie)
            .send({ quantity: 2 });

        expect(res.status).to.equal(200);
        expect(res.body.cart.products).to.satisfy(products =>
            products.some(p => p.product.toString() === productId && p.quantity === 2)
        );
    });

    it('Debe actualizar la cantidad de un producto en el carrito', async () => {
        const res = await requester
            .put(`/api/carts/${cartId}/products/${productId}`)
            .set('Cookie', cookie)
            .send({ quantity: 5 });

        expect(res.status).to.equal(200);
        expect(res.body.cart.products).to.satisfy(products =>
            products.some(p => p.product.toString() === productId && p.quantity === 5)
        );
    });

    it('Debe eliminar un producto del carrito', async () => {
        const res = await requester
            .delete(`/api/carts/${cartId}/products/${productId}`)
            .set('Cookie', cookie);

        expect(res.status).to.equal(200);
        expect(res.body.cart.products).to.satisfy(products =>
            !products.some(p => p.product.toString() === productId)
        );
    });

    it('Debe vaciar el carrito', async () => {
        const res = await requester
            .delete(`/api/carts/${cartId}`)
            .set('Cookie', cookie);

        expect(res.status).to.equal(200);
    });

    it('Debe obtener todos los carritos', async () => {
        const res = await requester
            .get('/api/carts')
            .set('Cookie', cookie);

        expect(res.status).to.equal(200);
        expect(res.body.carts).to.be.an('array');
    });
});
