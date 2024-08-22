import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

// Setup
const connectionString = `${process.env.TURSO_DATABASE_URL}`
const authToken = `${process.env.TURSO_AUTH_TOKEN}`

// Init prisma client
const libsql = createClient({
  url: connectionString,
  authToken,
})
const adapter = new PrismaLibSQL(libsql)
const prisma = new PrismaClient({ adapter })

export default prisma;
