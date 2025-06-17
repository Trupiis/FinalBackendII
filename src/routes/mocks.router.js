import { Router } from 'express'
import { generateMockUsers, generateMockProducts } from '../utils/mockGenerator.js'
import {UsuariosModelo} from '../dao/models/user.model.js'
import {ProductosModelo} from '../dao/models/product.model.js'


const router = Router()

router.get('/mockingusers', (req, res) => {
  const users = generateMockUsers(50)
  res.json(users)
})


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
