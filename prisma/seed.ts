import { PrismaClient, Prisma } from './generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: pool })

const guildData: Prisma.GuildCreateInput[] = [{
  guildId: '100017',
  name: 'Meownity'
}]

async function main() {
  console.log(`Start seeding ...`)

  // Clear existing data
  await prisma.guild.deleteMany()
  // await prisma.user.deleteMany()

  for (const g of guildData) {
    const guild = await prisma.guild.create({
      data: g,
    })
    console.log(`Created guild with id: ${guild.id}`)
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
