import { CoinService } from '@/lib/services/coinService';
import { DataTable } from '@/components/main/components/watchlist-table/data-table';
import { columns } from '@/components/main/components/watchlist-table/columns';
import EmptyCoinState from '../components/emptyCoinState';

import { unstable_noStore as noStore } from 'next/cache';

export default async function CryptocurrencyTemplate() {
  noStore();
  const { getWatchlistCoins } = new CoinService();

  const coins = await getWatchlistCoins();

  if (!coins || coins.length === 0) {
    return (
      <div className="mx-auto my-auto">
        <EmptyCoinState />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-2 pb-12">
      <DataTable columns={columns} data={coins} />
    </div>
  );
}
