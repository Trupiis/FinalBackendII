import { Router } from 'express'
import { generateMockUsers, generateMockProducts } from '../utils/mockGenerator.js'
import {UsuariosModelo} from '../dao/models/user.model.js'
import {ProductosModelo} from '../dao/models/product.model.js'


const router = Router()

/**
 * @swagger
 * /api/mocks/mockingusers:
 *   get:
 *     summary: Devuelve una lista de usuarios falsos generados (mock)
 *     tags: [Mocks]
 *     responses:
 *       200:
 *         description: Lista de usuarios generados con datos aleatorios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   role:
 *                     type: string
 *                   cart:
 *                     type: string
 *                     nullable: true
 */

router.get('/mockingusers', (req, res) => {
  const users = generateMockUsers(50)
  res.json(users)
})

/**
 * @swagger
 * /api/mocks/generateData:
 *   post:
 *     summary: Genera usuarios y productos falsos e inserta en la base de datos
 *     tags: [Mocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: integer
 *                 description: Cantidad de usuarios a generar
 *               products:
 *                 type: integer
 *                 description: Cantidad de productos a generar
 *     responses:
 *       200:
 *         description: Datos generados e insertados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 insertedUsers:
 *                   type: integer
 *                 insertedProducts:
 *                   type: integer
 *       500:
 *         description: Error generando los datos
 */

router.post('/generateData', async (req, res) => {
  try {
    const { users = 0, products = 0 } = req.body

    const mockUsers = generateMockUsers(users)
    const mockProducts = generateMockProducts(products)

    await UsuariosModelo.insertMany(mockUsers)
    await ProductosModelo.insertMany(mockProducts)

    res.json({
      message: 'Datos generados e insertados con éxito',
      insertedUsers: mockUsers.length,
      insertedProducts: mockProducts.length
    })
  } catch (error) {
    res.status(500).json({ error: 'Error generando datos', details: error.message })
  }
})



export default router



