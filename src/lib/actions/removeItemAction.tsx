'use server';

import { coinService } from '@/lib/services/coinService';
import { revalidatePath } from 'next/cache';

export async function removeItemAction(id: string) {
  const { removeCoin } = coinService;
  try {
    await removeCoin(id);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to remove the coin from your watchlist.');
  } finally {
    revalidatePath('/');
  }
}
