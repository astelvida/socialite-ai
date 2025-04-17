import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "../src/app/generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// Configure Prisma client with proper connection pooling
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["error", "warn"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  }).$extends(withAccelerate());
};

const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
