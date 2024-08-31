import type { ProductWithImages } from '@interfaces/product-with-images.interface'
import { ProductCard } from './ProductCard'

interface Props {
  products: ProductWithImages[] | undefined
}

export function ProductList({ products }: Props) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 place-items-center'>
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
