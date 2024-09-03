import type { CartItem } from '@interfaces/cart-item'
import Cookies from 'js-cookie'

export class CartCookiesClient {
  static getCart(): CartItem[] {
    return JSON.parse(Cookies.get('cart') ?? '[]')
  }

  static addItem(cartItem: CartItem): CartItem[] {
    const cart = CartCookiesClient.getCart()
    const itemInCart = cart.find(
      (item) => item.id === cartItem.id && item.size === cartItem.size
    )

    itemInCart
      ? (itemInCart.quantity += cartItem.quantity)
      : cart.push(cartItem)

    Cookies.set('cart', JSON.stringify(cart))

    return cart
  }

  static removeItem(id: string, size: string): CartItem[] {
    const cart = CartCookiesClient.getCart()
    const newCart = cart.filter(
      (item) => !(item.id === id && item.size === size)
    )

    Cookies.set('cart', JSON.stringify(newCart))

    return newCart
  }

  static clearCart(): CartItem[] {
    Cookies.remove('cart')
    return []
  }
}
