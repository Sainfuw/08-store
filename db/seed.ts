import { db, Product, ProductImage, Role, User } from 'astro:db'
import bcrypt from 'bcryptjs'
import { v4 as UUID } from 'uuid'
import { seedProducts } from './seed-data'

export default async function seed() {
  const roles = [
    { id: 'admin', name: 'Administrator' },
    { id: 'user', name: 'User' },
  ]

  const users = [
    {
      id: UUID(),
      name: 'Admin',
      email: 'admin@oops.lat',
      password: bcrypt.hashSync('admin', 10),
      role: 'admin',
    },
    {
      id: UUID(),
      name: 'User',
      email: 'user@oops.lat',
      password: bcrypt.hashSync('user', 10),
      role: 'user',
    },
  ]

  await db.insert(Role).values(roles)
  await db.insert(User).values(users)

  const queries: any = []
  seedProducts.forEach((p) => {
    const product = {
      id: UUID(),
      ...p,
      sizes: p.sizes.join(', '),
      tags: p.tags.join(', '),
      user: users[0].id,
    }
    queries.push(db.insert(Product).values(product))

    p.images.forEach((img) => {
      const image = {
        id: UUID(),
        image: img,
        productId: product.id,
      }

      queries.push(db.insert(ProductImage).values(image))
    })
  })

  await db.batch(queries)
}
