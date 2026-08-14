import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/client.js'

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL })
export const prisma = new PrismaClient({ adapter: pool })
