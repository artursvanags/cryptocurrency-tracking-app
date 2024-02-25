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
    totalSupply: coinData.total_supply,
    maxSupply: coinData.max_supply,
    totalVolume: coinData.total_volume,
    circulatingSupply: coinData.circulating_supply,
    high24h: coinData.high_24h,
    low24h: coinData.low_24h,
    marketCapRank: coinData.market_cap_rank,
  });