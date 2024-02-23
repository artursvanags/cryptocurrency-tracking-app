'use server';

import { CoinService } from '@/lib/services/coinService';
import { APICoinList } from '@/types';
import { revalidatePath } from 'next/cache';

export async function toggleItemAction(coinData: APICoinList) {
  const {  getWatchlistCoins, createCoin, removeCoin } = new CoinService();
  try {
    const watchlist = await getWatchlistCoins();
    const coinExists = watchlist.some((coin) => coin.slug === coinData.id);
    if (coinExists) {
      const selectedCoin = watchlist.find((coin) => coin.slug === coinData.id);
      if (selectedCoin) {
        await removeCoin(selectedCoin.id);
        return { message: `Removed ${coinData.name} from your watchlist.` };
      }
    } else {
      await createCoin(coinData);
      return { message: `Added ${coinData.name} to your watchlist.` };
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update the watchlist.');
  } finally {
    revalidatePath('/');
  }
}
