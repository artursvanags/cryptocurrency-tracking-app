import prismadb from '@/lib/database';
import { CoinDTO, CreateCoinDTO } from '@/types';
import { Coin } from '@prisma/client';

export function toDtoMapper(coin: Coin) {
  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
  };
}

export async function getCoin(id: string): Promise<CoinDTO> {
  const item = await prismadb.coin.findFirst({
    where: {
      id: id,
    },
  });
  if (!item) {
    throw new Error('could not find item');
  }
  return toDtoMapper(item);
}

export async function getCoins(): Promise<CoinDTO[]> {
  const items = await prismadb.coin.findMany();
  return items.map(toDtoMapper);
}

export async function addCoin(coin: CreateCoinDTO): Promise<void> {
  await prismadb.coin.create({
    data: {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
    },
  });
}

export async function addCoins(coins: CreateCoinDTO[]): Promise<void> {
  await prismadb.$transaction(async () => {
    for (const coin of coins) {
      await addCoin(coin);
    }
  });
}

export async function deleteCoin(id: CoinDTO['id']): Promise<void> {
  await prismadb.coin.delete({
    where: {
      id: id,
    },
  });
}

export async function deleteCoins(ids: CoinDTO['id'][]): Promise<void> {
  await prismadb.$transaction(async () => {
    for (const id of ids) {
      await deleteCoin(id);
    }
  });
}
