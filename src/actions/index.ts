import { login } from '@actions/auth/login.action'
import { logout } from '@actions/auth/logout.action'
import { register } from '@actions/auth/register.action'

import { getProductsByPage } from '@actions/products/get-products-by-page.action'
import { loadProductsFromCart } from './cart/load-products.action'
import { createUpdateProduct } from './products/create-update.action'
import { deleteProductImage } from './products/delete-image.action'
import { getProductBySlug } from './products/get-product-by-slug.actions'

export const server = {
  // Auth
  login,
  logout,
  register,

  // Products
  getProductsByPage,
  getProductBySlug,

  // Cart
  loadProductsFromCart,

  // Admin
  // Product
  createUpdateProduct,
  deleteProductImage,
}
