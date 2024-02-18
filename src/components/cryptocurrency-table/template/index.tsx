'use client';

import SearchBox from '@/components/cryptocurrency-table/components/search-box';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useState } from 'react';


const CryptocurrencyTableTemplate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function getCoins() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
    return await response.json();
  }

  const onCloseModal = (): void => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Add Cryptocurrency Coins"
        description="Search or select from trending coins to add to your watchlist."
        isOpen={isModalOpen}
        onClose={onCloseModal}
        className="max-h-screen md:min-w-full xl:min-w-[1200px]"
      >
        <SearchBox data={getCoins}/>
      </Modal>
      <Button onClick={() => setIsModalOpen(true)}>Add Coins</Button>
    </>
  );
};
export default CryptocurrencyTableTemplate;
