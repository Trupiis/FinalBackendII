import express from "express"
import passport from "passport";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controller/product.controller.js";
import authorize from "../middlewares/authorization.js";


const auth = passport.authenticate('jwt', { session: false });

const router = express.Router();


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
 */
router.get('/', getProducts); 

/**
 * @swagger
 * /api/products/{pid}:
 *   get:
 *     summary: Obtiene un producto por su ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:pid', getProductById); 

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto (solo admins)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               code:
 *                 type: string
 *               category:
 *                 type: string
 *               thumbnails:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 */
router.post('/', auth, authorize('admin'), addProduct);

/**
 * @swagger
 * /api/products/{pid}:
 *   put:
 *     summary: Actualiza un producto existente (solo admins)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               code:
 *                 type: string
 *               category:
 *                 type: string
 *               thumbnails:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:pid', auth, authorize('admin'), updateProduct);

/**
 * @swagger
 * /api/products/{pid}:
 *   delete:
 *     summary: Elimina un producto (solo admins)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:pid', auth, authorize('admin'), deleteProduct);

export default router;