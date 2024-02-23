import {
    APICoinList,
    CoinDataAPI,
    CreateCoinDTO,
    CreateCoinDataDTO,
} from '@/types';

export const mapAPICoinToDTO = (coin: APICoinList): CreateCoinDTO => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
  });
  
  export const mapAPICoinDataToDTO = (coinData: CoinDataAPI): CreateCoinDataDTO => ({
    marketCap: coinData.market_cap,
    volume: coinData.total_volume,
  });