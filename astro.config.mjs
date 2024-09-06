import db from '@astrojs/db'
import netlify from '@astrojs/netlify'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import auth from 'auth-astro'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), db(), auth(), react()],
  output: 'server',
  adapter: netlify(),
})
