import path from 'node:path'
import { defineConfig } from 'prisma/config'

const databaseUrl = process.env.DATABASE_URL || 'postgresql://gatare@localhost:5432/afrikatoday'

export default defineConfig({
  schema: path.join(__dirname, 'schema.prisma'),
  datasource: {
    url: databaseUrl,
  },
})
