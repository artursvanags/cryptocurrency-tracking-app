'use server';

import { CoinService } from '@/lib/services/coinService';
import { APICoinList, CoinDTO } from '@/types';
import { revalidatePath } from 'next/cache';

export async function removeItemAction(coinData: CoinDTO) {
  const { removeCoin } = new CoinService();
  try {
    await removeCoin(coinData.id);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to remove the coin from your watchlist.');
  } finally {
    revalidatePath('/');
  }
}
