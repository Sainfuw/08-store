import { defineAction } from 'astro:actions'
import { z } from 'astro:content'
import { db, eq, Product } from 'astro:db'
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
          .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
            message: `Only images are allowed, ${ALLOWED_FILE_TYPES.join(', ')}`,
          })
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

    form.id
      ? await db.update(Product).set(product).where(eq(Product.id, id))
      : await db.insert(Product).values(product)

    return product
  },
})
