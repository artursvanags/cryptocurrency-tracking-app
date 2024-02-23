'use client';

import { useEffect, useState } from 'react';

import { CoinService } from '@/lib/services/coinService';
import { APICoinList, CoinWatchlistItemWithCoinData } from '@/types';

import SearchInput from './search-input';
import { DataTable } from './data-table';
import { useToast } from '@/components/ui/use-toast';

interface AddItemsComponentProps {
  searchQuery: string | null;
  setSearchQuery: (query: string | null) => void;
}

const AddItemsComponent = ({
  searchQuery,
  setSearchQuery,
}: AddItemsComponentProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [queryData, setQueryData] = useState<APICoinList[]>([]);
  const [watchlistData, setWatchlistData] = useState<CoinWatchlistItemWithCoinData[]>([]);

  const service = new CoinService();

  const fetchQuery = async () => {
    try {
      if (queryData.length === 0) {
        setLoading(true);
        const data = await service.fetchCoinsFromAPI();
        setQueryData(data);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error instanceof Error && error.message,
      });
    }
    setLoading(false);
  };

  const fetchWatchlist = async () => {
    try {
      console.log('fetching watchlist');
      const data = await service.getWatchlistCoins();
      setWatchlistData(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error && error.message,
      });
    }
  };

  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      if (queryData.length === 0) {
        fetchQuery();
      }
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <div className="space-y-2">
      <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <DataTable
        watchlistData={watchlistData}
        fetchWatchlist={fetchWatchlist}
        loading={loading}
        searchQuery={searchQuery}
        queryData={queryData}
      />
    </div>
  );
};
export default AddItemsComponent;
