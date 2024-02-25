'use server';

import { coinService } from '@/lib/services/coinService';
import { APICoinList } from '@/types';
import { revalidatePath } from 'next/cache';

export async function addItemAction(coinData: APICoinList) {
  const { addCoinToQueue } = coinService;
  try {
    await addCoinToQueue(coinData);
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to add the coin to your watchlist.`);
  } finally {
    revalidatePath('/');
  }
}
