-- CreateTable
CREATE TABLE "UserCoinList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CoinData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "coinWatchlistId" TEXT,
    "marketCap" REAL,
    "volume" REAL,
    "totalSupply" REAL,
    "maxSupply" REAL,
    "totalVolume" REAL,
    "circulatingSupply" REAL,
    "high24h" REAL,
    "low24h" REAL,
    "marketCapRank" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CoinData_coinWatchlistId_fkey" FOREIGN KEY ("coinWatchlistId") REFERENCES "UserCoinList" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoinPriceHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coinDataId" TEXT NOT NULL,
    CONSTRAINT "CoinPriceHistory_coinDataId_fkey" FOREIGN KEY ("coinDataId") REFERENCES "CoinData" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CoinData_coinWatchlistId_key" ON "CoinData"("coinWatchlistId");
