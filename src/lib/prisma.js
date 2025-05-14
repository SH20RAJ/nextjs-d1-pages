import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// Helper function to initialize Prisma with D1
export function getPrismaClient() {
  try {
    // For production and when running with Cloudflare
    const { env } = getCloudflareContext();
    const adapter = new PrismaD1(env.DB);
    return new PrismaClient({ adapter });
  } catch (error) {
    // For development when Cloudflare context is not available
    console.warn('Cloudflare context not available, using SQLite for development');
    return new PrismaClient({
      datasources: {
        db: {
          url: 'file:./prisma/dev.db',
        },
      },
    });
  }
}

export const prisma = getPrismaClient();
