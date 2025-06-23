import express from 'express';
import methodOverride from 'method-override';
import {
    createCart, getCartById, addProductToCart, updateCart,
    updateProductQuantity, deleteProductFromCart, deleteCart,
    addProductSessionCart, purchaseCart, getAllCarts
} from '../controller/cart.controller.js';
import authorize from "../middlewares/authorization.js";
import passport from 'passport'; 
import { isAuth } from '../middlewares/auth.js';

const JWTauth  = isAuth;

const router = express.Router();

router.use(methodOverride('_method')); 


/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Obtiene todos los carritos
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de carritos
 */

router.get('/', JWTauth, getAllCarts);

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crea un nuevo carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Carrito creado exitosamente
 */
router.post('/', JWTauth, createCart);

/**
 * @swagger
 * /api/carts/{cid}:
 *   get:
 *     summary: Obtiene un carrito por su ID
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito encontrado
 */
router.get('/:cid', JWTauth, getCartById);

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   post:
 *     summary: Agrega un producto al carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto agregado al carrito
 */

router.post('/:cid/products/:pid', JWTauth, authorize('user'), addProductToCart);

/**
 * @swagger
 * /api/carts/{cid}:
 *   put:
 *     summary: Actualiza los productos del carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito actualizado
 */
router.put('/:cid', JWTauth, authorize('user'), updateCart); 

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   put:
 *     summary: Actualiza la cantidad de un producto en el carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cantidad del producto actualizada
 */
router.put('/:cid/products/:pid', JWTauth, authorize('user'), updateProductQuantity); 

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   delete:
 *     summary: Elimina un producto del carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 */
router.delete('/:cid/products/:pid', JWTauth, authorize('user'), deleteProductFromCart);

/**
 * @swagger
 * /api/carts/{cid}:
 *   delete:
 *     summary: Elimina un carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito eliminado
 */
router.delete('/:cid', JWTauth, authorize('user'), deleteCart); 

/**
 * @swagger
 * /api/carts/add-product:
 *   post:
 *     summary: Agrega un producto al carrito en sesión
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Producto agregado al carrito de sesión
 */
router.post('/add-product', JWTauth, authorize('user'), addProductSessionCart);

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Finaliza la compra del carrito
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compra finalizada exitosamente
 */
router.post('/:cid/purchase', JWTauth, authorize('user'), purchaseCart); 

export default router;