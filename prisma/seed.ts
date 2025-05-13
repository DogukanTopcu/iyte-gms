import prisma from '../lib/prisma'

async function main() {
  const response = await Promise.all([
    prisma.admin.create({
      data: {
        name: 'Admin',
        email: 'studentaffairs@iyte.edu.tr',
      },
    }),
  ])
  console.log(response)
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