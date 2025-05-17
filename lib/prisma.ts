import { PrismaClient } from '../lib/generated/prisma'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn']
  })
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export { prisma }