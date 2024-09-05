import { useStore } from '@nanostores/react'
import { itemsInCart } from '@store/cart.store'
import { CartCookiesClient } from '@utils/cart-cookies'
import { useEffect } from 'react'

export default function CardCounter() {
  const $itemsInCart = useStore(itemsInCart)

  useEffect(() => {
    const cart = CartCookiesClient.getCart()
    itemsInCart.set(cart.length)
  }, [$itemsInCart])

  return (
    <a href='/cart' className='relative inline-block'>
      {$itemsInCart > 0 && (
        <span className='absolute -top-1 -right-1 flex justify-center items-center bg-yellow-600 text-black font-bold text-xs rounded-full size-5'>
          {$itemsInCart}
        </span>
      )}
      <svg
        className='icon icon-tabler icon-tabler-garden-cart'
        width='28'
        height='28'
        viewBox='0 0 24 24'
        strokeWidth='1.5'
        stroke='currentColor'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path stroke='none' d='M0 0h24v24H0z' fill='none' />
        <path d='M17.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0' />
        <path d='M6 8v11a1 1 0 0 0 1.806 .591l3.694 -5.091v.055' />
        <path d='M6 8h15l-3.5 7l-7.1 -.747a4 4 0 0 1 -3.296 -2.493l-2.853 -7.13a1 1 0 0 0 -.928 -.63h-1.323' />
      </svg>
    </a>
  )
}
