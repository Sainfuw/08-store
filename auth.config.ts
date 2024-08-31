import type { AdapterUser } from '@auth/core/adapters'
import Credentials from '@auth/core/providers/credentials'
import { db, eq, User } from 'astro:db'
import { defineConfig } from 'auth-astro'
import bcrypt from 'bcryptjs'

export default defineConfig({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials

        const [user] = await db
          .select()
          .from(User)
          .where(eq(User.email, email as string))

        if (!user) throw new Error('Email or password is incorrect')

        if (!bcrypt.compareSync(password as string, user.password))
          throw new Error('Email or password is incorrect')

        const { password: _, ...userWithoutPassword } = user

        return userWithoutPassword
      },
    }),
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user)
      return token
    },
    session: async ({ session, token }) => {
      session.user = token.user as AdapterUser
      return session
    },
  },
})
