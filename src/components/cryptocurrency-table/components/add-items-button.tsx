'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { CoinService } from '@/lib/services/coinService';
import { APICoinList, CoinDTO } from '@/types';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

import SearchInput from './search-input';
import { DataTable } from './data-table';
import { debounce } from '@/lib/helpers/debounce';

const AddItems = () => {
  const router = useRouter();
  const searchParams = new URLSearchParams(useSearchParams());
  const search = searchParams.get('search');

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [queryData, setQueryData] = useState<APICoinList[]>([]);

  const [searchQuery, setSearchQuery] = useState<string | null>(search || null);

  const service = new CoinService();

  const fetchData = async () => {
    try {
      console.log('fetchData');
      if (queryData.length === 0) {
        console.log('Nothing in query data');
        setLoading(true);
        const data = await service.fetchCoins();
        setQueryData(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      searchParams.set('search', searchQuery.toLowerCase());
      if (queryData.length === 0) {
        fetchData();
      }

      if (search && !isModalOpen) {
        setIsModalOpen(true);
      }
    } else {
      searchParams.delete('search');
    }
    router.push(`?${searchParams.toString().toLowerCase()}`);
  }, [searchQuery, router]);

  const onModalClose = () => {
    const debouncedSetSearchQuery = debounce(() => setSearchQuery(null), 300);
    setIsModalOpen(false);
    debouncedSetSearchQuery();
  };

  return (
    <>
      <Modal
        title="Add Cryptocurrency Coins"
        description="Search or select from trending coins to add to your watchlist."
        isOpen={isModalOpen}
        onClose={onModalClose}
        className="max-h-screen xl:min-w-[800px]"
      >
        <div className="space-y-2">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <DataTable
            loading={loading}
            searchQuery={searchQuery}
            queryData={queryData}
          />
        </div>
      </Modal>
      <Button onClick={() => setIsModalOpen(true)}>Add Coins</Button>
    </>
  );
};
export default AddItems;
