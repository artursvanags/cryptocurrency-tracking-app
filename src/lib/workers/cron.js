const cron = require('node-cron');

import {
  getCoins,
  createPrice,
  createCoinData,
  updateCoinData,
} from '@/lib/repositories/coinRepository';
import { mapAPICoinDataToDTO } from '@/lib/mapper';
import { fetchAPICoinData } from '@/lib/repositories/apiRepository';
import { prunePriceHistories } from '@/lib/repositories/coinRepository';
import { settingsService } from '@/lib/services/settingsService';

console.log('Starting cron job');

let cronJob = null;
let currentInterval = null;
let intervalCheckLoop = null;
const { getInterval } = settingsService;

async function updateMarketDataBatch() {
  try {
    const coins = await getCoins();
    if (coins.length === 0) {
      console.log('No coins available. Cron has no jobs.');
      return;
    }

    const slugs = coins.map((coin) => coin.slug).join(',');
    const marketData = await fetchAPICoinData(slugs);

    for (const coin of coins) {
      try {
        if (!coin.slug) continue;

        const coinMarketData = marketData.find((data) => data.id === coin.slug);
        if (!coinMarketData) continue;
        const mappedCoin = mapAPICoinDataToDTO(coinMarketData);
        if (!coin.coinData) {
          const coinDataId = await createCoinData(mappedCoin, coin.id);

          coin.coinData = { id: coinDataId };
          console.log(`Created coin data for coin: ${coin.name}`);
        } else {
          await updateCoinData(mappedCoin, coin.coinData.id);
          console.log(`Updated coin data for coin: ${coin.name}`);
        }
        await createPrice(coinMarketData.current_price, coin.coinData.id);
        await prunePriceHistories(coin.coinData.id, 10);
      } catch (error) {
        console.error(
          `Failed to update market data for coin: ${coin.name}`,
          error,
        );
      }
    }
  } catch (error) {
    console.error(
      'Failed to fetch and update market data for all coins.',
      error,
    );
  }
}

async function startCronJob() {
  const interval = await getInterval();

  if (interval === currentInterval && cronJob) return;

  currentInterval = interval;

  if (cronJob) {
    cronJob.stop();
  }

  cronJob = cron.schedule(`*/${currentInterval} * * * * *`, async () => {
    await updateMarketDataBatch();
  });

  console.log(
    `Cron job restarted with an interval of every ${currentInterval} seconds.`,
  );
}

async function checkForIntervalChange() {
  const interval = await getInterval();
  if (interval !== currentInterval) {
    console.log(`Interval change detected: ${interval}. Restarting cron job.`);
    await startCronJob();
  }
}

function initIntervalCheckLoop() {
  if (intervalCheckLoop) {
    clearInterval(intervalCheckLoop);
  }

  intervalCheckLoop = setInterval(async () => {
    await checkForIntervalChange();
  }, 2000); // 2 seconds
}

(async () => {
  await startCronJob();
  initIntervalCheckLoop();
})();
