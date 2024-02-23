'use client';
import AddCoinsModal from '@/components/main/components/add-coins-modal';

const EmptyCoinState = () => {
  return (
    <div className="max-w-[720px] rounded border-4 border-dashed p-8 text-center text-muted-foreground">
      <h2 className=" text-2xl font-bold ">
        No cryptocurrency coins are found!
      </h2>
      <div className="pb-4">
        Start by adding a new coins to your watchlist. You can do this by
        clicking on the <span className="font-bold">Add Coins </span> button.
        Happy tracking!
      </div>
      <AddCoinsModal />
    </div>
  );
};

export default EmptyCoinState;
