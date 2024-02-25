'use client';
import AddCoinsModalButton from '@/components/main/components/add-coins-modal';

const EmptyCoinState = () => {
  return (
    <div className="rounded border-4 border-dashed p-8 text-center text-muted-foreground">
      <h2 className=" text-2xl font-semibold">
        No coins added to your watchlist!
      </h2>
      <div className="pb-4 text-sm">
        Start by adding a new coins to your watchlist. You can do this by
        clicking on the <span className="font-bold">Add Coins </span> button.
        Happy tracking!
      </div>
      <AddCoinsModalButton />
    </div>
  );
};

export default EmptyCoinState;
