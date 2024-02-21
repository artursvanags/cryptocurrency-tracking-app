import { CoinDTO } from "@/types";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toDtoMapper(coin: CoinDTO) {
  return {
    id: coin.id,
    slug: coin.slug,
    name: coin.name,
    symbol: coin.symbol,
    ...coin.coinData,
  };
}