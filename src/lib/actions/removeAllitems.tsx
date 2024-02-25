'use server';

import { coinService } from '@/lib/services/coinService';
import { revalidatePath } from 'next/cache';

export async function removeAllItemsAction() {
  const { removeAllCoins } = coinService;
  try {
    await removeAllCoins();
  } catch (error) {
    console.error(error);
    throw new Error('Failed to remove all coins from your watchlist.');
  } finally {
    revalidatePath('/');
  }
}
