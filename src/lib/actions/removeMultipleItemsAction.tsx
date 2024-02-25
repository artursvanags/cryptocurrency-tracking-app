'use server';

import { coinService } from '@/lib/services/coinService';
import { revalidatePath } from 'next/cache';

export async function removeMultipleItemsAction(ids: string[]) {
  const { removeMultipleCoins } = coinService;
  try {
    await removeMultipleCoins(ids);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to remove the coin from your watchlist.');
  } finally {
    revalidatePath('/');
  }
}
