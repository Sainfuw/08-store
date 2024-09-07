import { ImageUpload } from '@utils/image-upload'
import { defineAction } from 'astro:actions'
import { z } from 'astro:content'
import { db, eq, Product, ProductImage } from 'astro:db'
import { getSession } from 'auth-astro/server'
import { v4 as UUID } from 'uuid'

const MAX_FILE_SIZE = 5_000_000 // 5mb
const ALLOWED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
]

export const createUpdateProduct = defineAction({
  accept: 'form',
  input: z.object({
    id: z.string().optional(),
    description: z.string(),
    gender: z.string(),
    price: z.number(),
    sizes: z.string(),
    slug: z.string(),
    stock: z.number(),
    tags: z.string(),
    title: z.string(),
    type: z.string(),

    imageFiles: z
      .array(
        z
          .instanceof(File)
          .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: 'Max image size 5mb',
          })
          .refine(
            (file) => {
              if (file.size === 0) return true
              return ALLOWED_FILE_TYPES.includes(file.type)
            },
            {
              message: `Only images are allowed, ${ALLOWED_FILE_TYPES.join(', ')}`,
            }
          )
      )
      .optional(),
  }),

  handler: async (form, context) => {
    const session = await getSession(context.request)
    const user = session?.user

    if (!user?.id) throw new Error('User unauthorized or not found')

    const { id = UUID(), imageFiles, ...rest } = form
    rest.slug = rest.slug.toLowerCase().replaceAll(' ', '_').trim()
    const product = { id, user: user.id, ...rest }

    const queries: any = []

    form.id
      ? queries.push(db.update(Product).set(product).where(eq(Product.id, id)))
      : queries.push(db.insert(Product).values(product))

    const urls = await Promise.all(
      (imageFiles ?? []).map(async (file) => {
        if (file.size === 0) return ''

        return await ImageUpload.upload(file)
      })
    )

    if (urls.at(0) !== '') {
      queries.push(
        db
          .insert(ProductImage)
          .values(
            urls.map((url) => ({ id: UUID(), productId: id, image: url }))
          )
      )
    }

    await db.batch(queries)

    return product
  },
})
