import { CoinData, UserCoinList } from "@prisma/client";
import prismadb from "../database";

export class CoinRepository {

    async findUserCoinListBySlug(slug) {
        return prismadb.userCoinList.findUnique({
            where: { slug },
        });
    }

    /**
     * Creates a new UserCoinList entry along with its associated CoinData.
     * @param {Object} coinData The data of the coin to be created.
     * @returns The newly created UserCoinList entry.
     */
    async createUserCoinList(coinData:UserCoinList) {
        return prismadb.userCoinList.create({
            data: {
                slug: coinData.slug,
                name: coinData.name,
                symbol: coinData.symbol,
                coinData: coinData.coinData ? {
                    create: {
                        price: coinData.coinData.price,
                        marketCap: coinData.coinData.marketCap,
                        volume: coinData.coinData.volume,
                    },
                } : undefined,
            },
        });
    }
}