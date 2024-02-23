'use server';

import prismadb from '@/lib/database';
import { APICoinList, CoinDataDTO } from '@/types';
import { CoinWatchlist } from '@prisma/client';

/**
 * Fetches all coins from the database, including their associated coin data and price histories.
 */
export async function getCoins(): Promise<CoinWatchlist[]> {
  return prismadb.coinWatchlist.findMany({
    include: {
      coinData: {
        include: {
          priceHistories: true,
        },
      },
    },
  });
}

/**
 * Creates a new coin in the database.
 * @param coin - The coin information to create.
 * @returns The ID of the created coin.
 */
export async function createCoin(coin: APICoinList): Promise<string> {
  const createdCoin = await prismadb.coinWatchlist.create({
    data: {
      slug: coin.id,
      name: coin.name,
      symbol: coin.symbol,
    },
  });
  return createdCoin.id;
}

/**
 * Removes a coin and its associated data from the database based on the coin's ID.
 * @param id - The ID of the coin to remove.
 */
export async function removeCoin(id: string): Promise<void> {
  await prismadb.coinWatchlist.delete({
    where: { id },
  });
}

/**
 * Creates additional data for a specific coin.
 * @param coinData - The additional data to create for the coin.
 * @param coinWatchlistId - The ID of the coin to associate the data with.
 * @returns The ID of the created coin data.
 */
export async function createCoinData(
  coinData: CoinDataDTO,
  coinWatchlistId: string,
): Promise<string> {
  const createdCoinData = await prismadb.coinData.create({
    data: {
      ...coinData,
      coinWatchlistId,
    },
  });
  return createdCoinData.id;
}

/**
 * Updates the data for a specific coin.
 * @param coinData - The updated data for the coin.
 * @param id - The ID of the coin data to update.
 */
export async function updateCoinData(
  coinData: CoinDataDTO,
  id: string,
): Promise<void> {
  await prismadb.coinData.update({
    where: { id },
    data: coinData,
  });
}

/**
 * Creates a price history record for a coin.
 * @param price - The price to record.
 * @param coinDataId - The ID of the coin data to associate the price with.
 */
export async function createPrice(price: number, coinDataId: string): Promise<void> {
  await prismadb.coinPriceHistory.create({
    data: {
      price,
      coinDataId,
    },
  });
}
/**
 * Prunes price histories for a specific coin data, keeping only a specified number of records.
 * @param coinDataId - The ID of the coin data.
 * @param keep - The number of price histories to keep.
 */
export async function prunePriceHistories(coinDataId: string, keep: number): Promise<void> {
  const priceHistories = await prismadb.coinPriceHistory.findMany({
    where: { coinDataId: coinDataId },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (priceHistories.length > keep) {
    const idsToDelete = priceHistories.slice(keep).map(history => history.id);
    await prismadb.coinPriceHistory.deleteMany({
      where: {
        id: { in: idsToDelete },
      },
    });
  }
}