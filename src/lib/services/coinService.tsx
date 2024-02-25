import {
  getCoins,
  getCoin,
  createCoin,
  createCoinData,
  createPrice,
  removeCoin,
  removeMultipleCoins,
  removeAllCoins,
} from '@/lib/repositories/coinRepository';
import {
  fetchAPICoins,
  fetchAPICoinData,
} from '@/lib/repositories/apiRepository';
import {
  APICoinList,
  CoinWatchlistItemWithCoinData,
} from '@/types';
import { mapAPICoinDataToDTO, mapAPICoinToDTO } from '@/lib/mapper';
import { debounce } from '@/lib/helpers/debounce';

export class CoinService {
  private static instance: CoinService;
  private coinDataQueue: {
    incomingCoinData: APICoinList;
    databaseCoinId: string;
  }[] = [];
  processQueueDebounced: () => void;

  private constructor() {
    this.addCoinToQueue = this.addCoinToQueue.bind(this);
    this.processQueue = this.processQueue.bind(this);
    this.fetchCoinsFromAPI = this.fetchCoinsFromAPI.bind(this);
    this.fetchCoinDataFromAPI = this.fetchCoinDataFromAPI.bind(this);
    this.getWatchlistCoins = this.getWatchlistCoins.bind(this);
    this.createCoin = this.createCoin.bind(this);
    this.removeCoin = this.removeCoin.bind(this);
    this.removeMultipleCoins = this.removeMultipleCoins.bind(this);
    this.removeAllCoins = this.removeAllCoins.bind(this);
    this.processQueueDebounced = debounce(() => this.processQueue(), 5000);
    this.coinDataQueue = [];
  }

  public static getInstance(): CoinService {
    if (!CoinService.instance) {
      CoinService.instance = new CoinService();
    }
    return CoinService.instance;
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

  async getWatchlistCoin(coinId: string): Promise<CoinWatchlistItemWithCoinData> {
    try {
      const coin = await getCoin(coinId);
      return coin as CoinWatchlistItemWithCoinData; // Avoid Prisma problem with type
    } catch (error) {
      console.error('Failed to retrieve coin from the database', error);
      throw new Error('Failed to get stored coins');
    }
  }
  async createCoin(coin: APICoinList): Promise<string> {
    const coinDTO = mapAPICoinToDTO(coin);

    try {
      return await createCoin(coinDTO);
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

  async removeMultipleCoins(ids: string[]): Promise<void> {
    try {
      await removeMultipleCoins(ids);
    } catch (error) {
      console.error('Failed to remove multiple coins', error);
      throw new Error('Failed to remove multiple coins');
    }
  }

  async removeAllCoins(): Promise<void> {
    try {
      await removeAllCoins();
    } catch (error) {
      console.error('Failed to remove all coins', error);
      throw new Error('Failed to remove all coins');
    }
  }

  async addCoinToQueue(coin: APICoinList): Promise<void> {
    const coinId = await this.createCoin(coin);
    this.coinDataQueue.push({ incomingCoinData: coin, databaseCoinId: coinId });
    this.processQueueDebounced();
  }

  private async processQueue(): Promise<void> {
    try {
      const coins = this.coinDataQueue;
      if (coins.length === 0) {
        return;
      }

      const slugs = coins.map((coin) => coin.incomingCoinData.id).join(',');
      const marketData = await fetchAPICoinData(slugs);

      for (const coin of coins) {
        try {
          const coinMarketData = marketData.find(
            (data) => data.id === coin.incomingCoinData.id,
          );
          if (!coinMarketData) {
            console.error(
              `No market data found for coin with ID ${coin.incomingCoinData.id}`,
            );
            continue;
          }

          const mappedCoin = mapAPICoinDataToDTO(coinMarketData);
          const coinDataId = await createCoinData(
            mappedCoin,
            coin.databaseCoinId,
          );
          await createPrice(coinMarketData.current_price, coinDataId);
        } catch (error) {
          console.error('Error processing coin:', coin, error);
        }
      }
    } catch (error) {
      console.error('Error processing queue:', error);
    } finally {
      this.coinDataQueue = [];
      console.log('Queue processed');
    }
  }
}
export const coinService = CoinService.getInstance();
