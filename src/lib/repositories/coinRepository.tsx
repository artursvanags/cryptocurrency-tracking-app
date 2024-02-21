'use server';
import prismadb from '@/lib/database';

import { APICoinList, CoinDTO, createCoinDTO } from '@/types';
import { toDtoMapper } from '@/lib/utils';
import { getLargeDataFromRedis, redis, setLargeDataInRedis } from '../redis';

export async function fetchAPICoins(): Promise<APICoinList[]> {
  const cachedCoinList = await getLargeDataFromRedis('coinList');
  if (cachedCoinList) {
    return cachedCoinList;
  } else {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/list?include_platform=true',
    );
    const data = await response.json();
    await setLargeDataInRedis('coinList', data);
    return data;
  }
}

export async function getAPICoinData(ids: string[]) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${ids}&locale=en`,
    // no cache
    { cache: 'no-cache' },
  );
  const data = await response.json();
  return data;
}

export async function createCoin(coin: APICoinList): Promise<void> {
  await prismadb.coinWatchlist.create({
    data: {
      slug: coin.id,
      name: coin.name,
      symbol: coin.symbol,
    },
  });
}

export async function getCoins(): Promise<CoinDTO[]> {
  const items = await prismadb.coinWatchlist.findMany();
  return items.map(toDtoMapper);
}

/* export async function getUserCoin(slug: string): Promise<CoinDTO> {
  const item = await prismadb.coinWatchlist.findFirst({
    where: {
      slug: slug,
    },
  });
  if (!item) {
    throw new Error('could not find item');
  }
  return toDtoMapper(item);
} */

/* export async function getUserCoins(): Promise<CoinDTO[]> {
  const items = await prismadb.coinWatchlist.findMany();
  return items.map(toDtoMapper);
} */