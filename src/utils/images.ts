export const getFullImages = (images: string[]) =>
  images.map((i) => {
    return i.startsWith('http')
      ? i
      : `${import.meta.env.PUBLIC_URL}/images/products/${i}`
  })
