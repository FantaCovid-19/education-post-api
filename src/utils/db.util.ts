import { PrismaClient } from '@prisma/client';

let db: PrismaClient;

export function getDb(): PrismaClient {
  if (!db) {
    db = new PrismaClient();
  }

  return db;
}

export async function disconnectDb(): Promise<void> {
  await db.$disconnect();
}

export async function connectDb(): Promise<void> {
  await db.$connect();
}

db = getDb();
export { db };
