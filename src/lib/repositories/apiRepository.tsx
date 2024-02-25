'use server';

import { CoinDataAPI, APICoinList } from '@/types';
import { getLargeDataFromRedis, setLargeDataInRedis } from '@/lib/redis';
import { settingsService } from '@/lib/services/settingsService';

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
    const proApiKey = await settingsService.getAPI();

    const baseURL = proApiKey
      ? `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${ids}&locale=en`
      : `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${ids}&locale=en`;

    const queryString = proApiKey ? `&x_cg_pro_api_key=${proApiKey}` : '';
    const finalURL = `${baseURL}${queryString}`;

    const response = await fetch(finalURL, { cache: 'no-cache' });
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
/**
 * Pings the API to check if it is reachable.
 *
 * @returns A promise that resolves to a boolean indicating if the API is reachable.
 */
export async function pingAPI(): Promise<boolean> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/ping');
    return response.ok;
  } catch (error) {
    console.error('Failed to ping the API.', error);
    throw new Error('Failed to ping the API.');
  }
}