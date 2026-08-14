import { PrismaClient, Prisma } from './generated/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: pool })

const guildData: Prisma.GuildCreateInput[] = [{
  guildId: '100017',
  name: 'Meownity'
}]

const roleData: Prisma.RoleCreateInput[] = [{
  name: 'Admin'
}, {
  name: 'GuildAdmin'
}, {
  name: 'Member'
}]

async function main() {
  console.log(`Start seeding ...`)

  // Clear existing data
  await prisma.guild.deleteMany()
  await prisma.role.deleteMany()

  for (const g of guildData) {
    const guild = await prisma.guild.create({
      data: g,
    })
    console.log(`Created guild with id: ${guild.id}`)
  }
  for (const r of roleData) {
    const role = await prisma.role.create({
      data: r,
    })
    console.log(`Created role with id: ${role.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
