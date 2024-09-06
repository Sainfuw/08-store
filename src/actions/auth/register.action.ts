import { defineAction } from 'astro:actions'
import { z } from 'astro:content'

export const register = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
  handler: async ({ name, email, password }, { cookies }) => {
    return { ok: true }
  },
})
