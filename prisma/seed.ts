import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const sampleData = [
  {
    slug: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'btc',
  },
  {
    slug: 'ethereum',
    name: 'Ethereum',
    symbol: 'eth',
  },
];

async function main() {
  try {
    const operations = sampleData.map(async (item) => {
      const existingData = await prisma.coinWatchlist.findFirst({
        where: { slug: item.slug },
      });

      console.log(
        'Seed data for coin -',
        item.slug,
        'exists:',
        !!existingData,
      );

      if (!existingData) {
        const data = {
          slug: item.slug,
          name: item.name,
          symbol: item.symbol,
        };
        console.log('Creating seed data for coin -', item.slug);
        return prisma.coinWatchlist.create({
          data: data,
        });
      }
    });
    await Promise.all(operations);
    console.log('Seed script executed successfully!');
  } catch (error) {
    console.error('Error executing seed script:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
