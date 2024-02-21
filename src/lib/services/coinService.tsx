import {
  createCoin,
  fetchAPICoinData,
  fetchAPICoins,
  getCoins,
  removeCoin,
} from '@/lib/repositories/coinRepository';
import { APICoinList, CoinDTO, createCoinDTO } from '@/types';

export class CoinService {
  async fetchCoins() {
    return fetchAPICoins();
  }

  async fetchCoinData(ids: string[]) {
    return fetchAPICoinData(ids);
  }

  async getCoins() {
    return getCoins();
  }
  async addItem(coinData: APICoinList) {
    const watchlist = await this.getCoins();
    const coinExists = watchlist.some((coin) => coin.slug === coinData.id);

    if (coinExists) {
      //TO-DO, make notification on client-side
      throw new Error(`Coin with symbol ${coinData.symbol} already exists.`);
    }

    const selectedCoin: createCoinDTO = {
      id: coinData.id,
      name: coinData.name,
      symbol: coinData.symbol,
    };
    await createCoin(selectedCoin);
  }
  async removeItem(id: CoinDTO['id']) {
    await removeCoin(id);
  }
}
