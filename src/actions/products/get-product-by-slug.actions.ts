import { defineAction } from 'astro:actions'
import { z } from 'astro:content'
import { db, eq, Product, ProductImage } from 'astro:db'

const newProduct = {
  id: '',
  description: 'nueva descripcion',
  gender: 'men',
  price: 100,
  sizes: 'XS,S,M',
  slug: 'nuevo_producto',
  stock: 4,
  tags: 'shirt,men,nuevo',
  title: 'Nuevo producto',
  type: 'shirts',
  images: [],
}

export const getProductBySlug = defineAction({
  accept: 'json',
  input: z.string(),
  handler: async (slug) => {
    if (slug === 'new') {
      return {
        product: newProduct,
      }
    }

    const [product] = await db
      .select()
      .from(Product)
      .where(eq(Product.slug, slug))

    if (!product) throw new Error('Product not found')

    const images = await db
      .select()
      .from(ProductImage)
      .where(eq(ProductImage.productId, product.id))

    return {
      product: { ...product, images },
    }
  },
})
