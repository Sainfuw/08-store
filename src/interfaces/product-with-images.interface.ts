export interface ProductWithImages {
  images: string[]
  type: string
  id: string
  description: string
  gender: string
  price: number
  sizes: string
  slug: string
  stock: number
  tags: string
  title: string
  // gender: 'men' | 'women' | 'kid' | 'unisex'
  user: string
}
