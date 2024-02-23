'use server';

import { CoinService } from '@/lib/services/coinService';
import { APICoinList } from '@/types';
import { revalidatePath } from 'next/cache';

export async function addItemAction(coinData: APICoinList) {
  const { createCoin } = new CoinService();
  try {
    await createCoin(coinData);
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to add the coin to your watchlist.`);
  } finally {
    revalidatePath('/');
  }
}
