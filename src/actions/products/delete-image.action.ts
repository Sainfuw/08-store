import { ImageUpload } from '@utils/image-upload'
import { defineAction } from 'astro:actions'
import { z } from 'astro:content'
import { db, eq, ProductImage } from 'astro:db'

export const deleteProductImage = defineAction({
  accept: 'json',
  input: z.string(),
  handler: async (imageId) => {
    const [productImage] = await db
      .select()
      .from(ProductImage)
      .where(eq(ProductImage.id, imageId))

    if (!productImage) throw new Error('Product image not found')

    await db.delete(ProductImage).where(eq(ProductImage.id, imageId))

    const cloudinary = productImage.image.startsWith('http')

    if (cloudinary) {
      return await ImageUpload.delete(productImage.image)
    }

    return false
  },
})
