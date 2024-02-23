import {
  getCoins,
  createCoin,
  removeCoin,
  createCoinData,
  createPrice,
} from '@/lib/repositories/coinRepository';
import {
  fetchAPICoins,
  fetchAPICoinData,
} from '@/lib/repositories/apiRepository';
import { APICoinList, CoinDTO, CoinWatchlistItemWithCoinData } from '@/types';
import { mapAPICoinDataToDTO, mapAPICoinToDTO } from '../mapper';
import { CoinWatchlist } from '@prisma/client';

export class CoinService {
  constructor() {
    this.fetchCoinsFromAPI = this.fetchCoinsFromAPI.bind(this);
    this.fetchCoinDataFromAPI = this.fetchCoinDataFromAPI.bind(this);
    this.getWatchlistCoins = this.getWatchlistCoins.bind(this);
    this.createCoin = this.createCoin.bind(this);
    this.removeCoin = this.removeCoin.bind(this);
  }

  async fetchCoinsFromAPI(): Promise<APICoinList[]> {
    try {
      const coins = await fetchAPICoins();
      return coins;
    } catch (error) {
      console.error('Failed to fetch coins from API', error);
      throw new Error('Failed to fetch coins');
    }
  }

  async fetchCoinDataFromAPI(coinId: string): Promise<any> {
    try {
      const coinData = await fetchAPICoinData(coinId);
      return coinData;
    } catch (error) {
      console.error(`Failed to fetch data for coin with ID ${coinId}`, error);
      throw new Error('Failed to fetch coin data');
    }
  }

  async getWatchlistCoins(): Promise<CoinWatchlistItemWithCoinData[]> {
    try {
      const coins = await getCoins();
      return coins;
    } catch (error) {
      console.error('Failed to retrieve coins from the database', error);
      throw new Error('Failed to get stored coins');
    }
  }

  async createCoin(coin: APICoinList): Promise<void> {
    try {
      const coinDTO = mapAPICoinToDTO(coin);

      const coinDB = await createCoin(coinDTO);

      const coinDataFromAPI = await this.fetchCoinDataFromAPI(coin.id);
      if (coinDataFromAPI?.length > 0) {
        const [apiCoinData] = coinDataFromAPI;
        const newCoinData = mapAPICoinDataToDTO(apiCoinData);

        const createdCoinData = await createCoinData(newCoinData, coinDB);

        if (apiCoinData.current_price) {
          await createPrice(apiCoinData.current_price, createdCoinData);
        }
      } else {
        console.log('No data fetched from API for coin id:', coin.id);
      }
    } catch (error) {
      throw new Error('Failed to add coin');
    }
  }

  async removeCoin(id: string): Promise<void> {
    try {
      await removeCoin(id);
    } catch (error) {
      console.error(`Failed to remove coin with ID ${id}`, error);
      throw new Error('Failed to remove coin');
    }
  }
}
