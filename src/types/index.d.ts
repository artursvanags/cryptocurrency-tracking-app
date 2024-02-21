import { CoinData } from "@prisma/client";

export type CoinDTO = {
  slug: string;
  name: string;
  symbol: string;
  coinData?: CoinData;
};

export type APICoinList = {
  id: string;
  name: string;
  symbol: string;
  platforms?: Records<string, string>;
};

export type createCoinDTO = APICoinList;
