import { CoinData, CoinWatchlist, PriceHistory } from '@prisma/client';

export interface CoinWatchlistItemWithCoinData extends CoinWatchlist {
  coinData?: CoinData & { priceHistories?: PriceHistory[] };
}

export interface APICoinList {
  id: string;
  name: string;
  symbol: string;
  platforms?: string[];
}

export interface CoinDTO {
  id: string;
  name: string;
  symbol: string;
}

export interface CoinDataDTO {
  marketCap?: number;
  volume?: number;
  totalSupply?: number;
  maxSupply?: number | null;
  totalVolume?: number;
  circulatingSupply?: number;
  high24h?: number;
  low24h?: number;
  marketCapRank?: number;
}

export interface CreateCoinDTO {
  id: string;
  name: string;
  symbol: string;
}

export interface CreateCoinDataDTO {
  marketCap?: number;
  volume?: number;
  totalSupply?: number;
  maxSupply?: number | null;
  totalVolume?: number;
  circulatingSupply?: number;
  high24h?: number;
  low24h?: number;
  marketCapRank?: number;
}

export interface CoinDataAPI {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: { times: number; currency: string; percentage: number } | null;
  last_updated: string;
}

export interface Settings {
  cronInterval: number;
  pro_api: string | undefined;
}
