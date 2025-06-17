import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

export const generateMockUsers = (count = 1) => {
  const users = []
  for (let i = 0; i < count; i++) {
    users.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync('coder123', 10),
      role: faker.helpers.arrayElement(['user', 'admin']),
      cart: null // si usás carts relacionados
    })
  }
  return users
}

export const generateMockProducts = (count = 1) => {
  const products = []
  for (let i = 0; i < count; i++) {
    products.push({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      stock: faker.number.int({ min: 1, max: 100 }),
      code: faker.string.alphanumeric(10),
      category: faker.commerce.department(),
      thumbnails: [faker.image.url()],
      status: true
    })
  }
  return products
}
