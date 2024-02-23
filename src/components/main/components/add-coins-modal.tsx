'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { debounce } from '@/lib/helpers/debounce';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

import AddItemsComponentProps from '@/components/main/components/search-table/add-items-component';

const AddCoinsModal = () => {
  const router = useRouter();
  const searchParams = new URLSearchParams(useSearchParams());
  const search = searchParams.get('search');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(search || null);

  const onModalClose = () => {
    const debouncedSetSearchQuery = debounce(() => setSearchQuery(null), 300);
    setIsModalOpen(false);
    debouncedSetSearchQuery();
  };

  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      searchParams.set('search', searchQuery.toLowerCase());
      if (search && !isModalOpen) {
        setIsModalOpen(true);
      }
    } else {
      searchParams.delete('search');
    }
    router.push(`?${searchParams.toString().toLowerCase()}`);
  }, [searchQuery, router]);

  return (
    <>
      <Modal
        title="Add Cryptocurrency Coins"
        description="Search or select from trending coins to add to your watchlist."
        isOpen={isModalOpen}
        onClose={onModalClose}
        className="max-h-screen xl:min-w-[800px]"
      >
        <AddItemsComponentProps searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </Modal>
      <Button onClick={() => setIsModalOpen(true)}>Add Coins</Button>
    </>
  );
};
export default AddCoinsModal;
