'use server';

import { CoinDataAPI, APICoinList } from '@/types';
import { getLargeDataFromRedis, setLargeDataInRedis } from '@/lib/redis';
/**
 * 
 * @returns A promise that resolves to an array of APICoinList objects.
 */
export async function fetchAPICoins(): Promise<APICoinList[]> {
  try {
    const cachedCoinList = await getLargeDataFromRedis('coinList');
    if (cachedCoinList) {
      return cachedCoinList;
    } else {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/list?include_platform=true',
      );
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      const data: APICoinList[] = await response.json();
      await setLargeDataInRedis('coinList', data);
      return data;
    }
  } catch (error) {
    console.error('Failed to fetch coins from cache or API.', error);
    throw new Error('Failed to fetch coins from cache or API.');
  }
}
/**
 * Fetches coin market data from the API based on the provided coin IDs.
 * 
 * @param ids The IDs of the coins to fetch data for.
 * @returns A promise that resolves to an array of CoinDataAPI objects.
 */
export async function fetchAPICoinData(ids: string): Promise<CoinDataAPI[]> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${ids}&locale=en`,
      { cache: 'no-cache' },
    );
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const data: CoinDataAPI[] = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch coin market data from API.', error);
    throw new Error('Failed to fetch coin market data from API.');
  }
}
