import { login } from '@actions/auth/login.action'
import { logout } from '@actions/auth/logout.action'
import { register } from '@actions/auth/register.action'

import { getProductsByPage } from '@actions/products/get-products-by-page.action'

export const server = {
  // actions

  // Auth
  login,
  logout,
  register,

  // Products
  getProductsByPage,
}
