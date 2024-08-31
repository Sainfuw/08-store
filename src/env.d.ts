/// <reference path="../.astro/types.d.ts" />

interface User {
  email: string
  name: string
}

declare namespace App {
  interface Locals {
    user: User | null
    isLoggedIn: boolean
    isAdmin: boolean
  }
}
