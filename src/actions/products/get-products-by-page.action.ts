import { defineAction } from 'astro:actions'
import { z } from 'astro:content'
import { count, db, eq, Product, ProductImage } from 'astro:db'

export const getProductsByPage = defineAction({
  accept: 'json',
  input: z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(12),
  }),
  handler: async ({ page, limit }) => {
    page = page < 1 ? 1 : page

    const [totalRecords] = await db.select({ count: count() }).from(Product)
    const totalPages = Math.ceil(totalRecords.count / limit)

    page > totalPages && (page = totalPages)

    const products = await db
      .select()
      .from(Product)
      .limit(limit)
      .offset((page - 1) * limit)

    const productWithImages = await Promise.all(
      products.map(async (p) => {
        const images = await db
          .select()
          .from(ProductImage)
          .where(eq(ProductImage.productId, p.id))
          .limit(2)

        return {
          ...p,
          images: images.length ? images.map((i) => i.image) : ['no-image.png'],
        }
      })
    )

    // Metodo de consulta sql plana, peligrosa por el sql injection

    // const productsQuery = sql`
    //   SELECT a.*,
    //   (SELECT GROUP_CONCAT(image) FROM
    //     (SELECT image FROM ${ProductImage} WHERE productId = a.id LIMIT 2)
    //   ) AS images
    //   FROM ${Product} a
    //   LIMIT ${limit} OFFSET ${(page - 1) * limit}
    // `

    // const { rows } = await db.run(productsQuery)
    // console.log(rows)

    return {
      // products: rows as unknown as ProductWithImages,
      products: productWithImages,
      totalPages,
    }
  },
})
