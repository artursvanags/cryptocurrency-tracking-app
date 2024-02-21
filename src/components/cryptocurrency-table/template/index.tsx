'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { CoinService } from '@/lib/services/coinService';
import { APICoinList } from '@/types';

import SearchBox from '@/components/cryptocurrency-table/components/search-box';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

const AddItems = () => {
  const router = useRouter();
  const searchParams = new URLSearchParams(useSearchParams());
  const search = searchParams.get('search');

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [query, setQuery] = useState<APICoinList[]>([]);
  const [searchQuery, setSearchQuery] = useState<string | null>(search || null);

  const service = new CoinService();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await service.fetchCoins();
      setQuery(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      searchParams.set('search', searchQuery);
      if (query.length === 0) {
        fetchData();
      }
    } else {
      searchParams.delete('search');
    }
    router.push(`?${searchParams.toString()}`);
  }, [searchQuery, router]);

  const onModalClose = () => {
    setIsModalOpen(false);
    setSearchQuery(null);
  };

  return (
    <>
      <Modal
        title="Add Cryptocurrency Coins"
        description="Search or select from trending coins to add to your watchlist."
        isOpen={isModalOpen}
        onClose={onModalClose}
        className="max-h-screen md:min-w-full xl:min-w-[1200px]"
      >
        <SearchBox
          data={query}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          loading={loading}
        />
      </Modal>
      <Button onClick={() => setIsModalOpen(true)}>Add Coins</Button>
    </>
  );
};
export default AddItems;
