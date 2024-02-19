import { createCoin, getAPICoinData, getAPICoins, getCoins } from '@/lib/repositories/coinRepository';
import { APICoinList, CoinDTO, createCoinDTO } from '@/types';

export class CoinService {
  async getAPICoins() {
    return getAPICoins();
  }

  async getAPICoinData(ids: string[]) {
    return getAPICoinData(ids);
  }
  async getWatchlistCoins() {
    return getCoins();
  }
  async addCoin(coinData: APICoinList) {
    const watchlist = await this.getWatchlistCoins();

    const coinExists = watchlist.some(
      (coin) => coin.slug === coinData.id,
    );

    if (coinExists) {
      //TO-DO, make notifiation on client-side
      throw new Error(`Coin with symbol ${coinData.symbol} already exists.`);
    }

    const selectedCoin: createCoinDTO = {
      id: coinData.id,
      name: coinData.name,
      symbol: coinData.symbol,
    };

    await createCoin(selectedCoin);
  }
}
