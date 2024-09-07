import type { ProductWithImages } from '@interfaces/product-with-images.interface'
import { getFullImages } from '@utils/images'
import { useState } from 'react'

interface Props {
  product: ProductWithImages
}

export function ProductCard({ product }: Props) {
  const images = getFullImages(product.images.map((i) => i.image))

  const [currentImage, setCurrentImage] = useState(images[0])

  return (
    <a href={`/products/${product.slug}`}>
      <img
        className='rounded-lg object-contain h-[350px]'
        src={currentImage}
        alt={product.title}
        onMouseEnter={() => setCurrentImage(images[1] || images[1])}
        onMouseLeave={() => setCurrentImage(images[0])}
      />
      <h4>{product.title}</h4>
      <p>${product.price}</p>
    </a>
  )
}
