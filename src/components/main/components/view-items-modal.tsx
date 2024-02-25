'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { debounce } from '@/lib/helpers/debounce';

import { CoinWatchlistItemWithCoinData } from '@/types';

import { coinService } from '@/lib/services/coinService';
import { useToast } from '@/components/ui/use-toast';
import { ModalDrawerComponent } from '@/components/ui/modal-drawer';
import { ItemDetails } from './items/item-details';

const ViewItemsModal = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(useSearchParams());
  const itemParam = searchParams.get('item') || '';

  const [itemData, setItemData] =
    useState<CoinWatchlistItemWithCoinData | null>(null);

  const { getWatchlistCoin } = coinService;

  const fetchItem = async () => {
    try {
      if (!itemData) {
        setLoading(true);
        const data = await getWatchlistCoin(itemParam);
        setItemData(data);
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

  const onModalClose = () => {
    const debouncedEmptyItems = debounce(() => setItemData(null), 300);
    searchParams.delete('item');
    router.push(`?${searchParams.toString().toLowerCase()}`);
    setIsModalOpen(false);
    debouncedEmptyItems();
  };

  useEffect(() => {
    if (itemParam && !isModalOpen) {
      setIsModalOpen(true);
    }
    fetchItem();
  }, [itemParam, router]);

  return (
    <>
      <ModalDrawerComponent
        isOpen={isModalOpen}
        onClose={onModalClose}
      >
        <ItemDetails itemData={itemData} loading={loading} onModalClose={onModalClose} />
      </ModalDrawerComponent>
    </>
  );
};

export default ViewItemsModal;
