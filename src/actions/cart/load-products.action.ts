import type { CartItem } from '@interfaces/cart-item'
import { getFullImages } from '@utils/images'
import { defineAction } from 'astro:actions'
import { z } from 'astro:content'
import { db, eq, inArray, Product, ProductImage } from 'astro:db'

export const loadProductsFromCart = defineAction({
  accept: 'json',
  input: z.string(),
  handler: async (cartCookies) => {
    const cart = JSON.parse(cartCookies) as CartItem[]

    if (cart.length === 0) return []

    const productIds = cart.map((item) => item.id)

    const dbProducts = await db
      .select()
      .from(Product)
      .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
      .where(inArray(Product.id, productIds))

    return cart.map((cartItem) => {
      const product = dbProducts.find((p) => p.Product.id === cartItem.id)
      if (!product) throw new Error('Product not found')

      const { title, price, slug } = product.Product
      const { image } = product.ProductImage

      return {
        ...cartItem,
        title,
        price,
        image: getFullImages([image]).at(0),
        slug,
      }
    })
  },
})
