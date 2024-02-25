import { Skeleton } from '@/components/ui/skeleton';
import { CoinWatchlistItemWithCoinData } from '@/types';
import { currencyFormatter } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/config/icons';
import { toast } from '@/components/ui/use-toast';
import { removeItemAction } from '@/lib/actions/removeItemAction';

interface ItemDetailsProps {
  itemData: CoinWatchlistItemWithCoinData | null;
  loading: boolean;
  onModalClose: () => void;
}

export const ItemDetails = ({
  itemData,
  loading,
  onModalClose,
}: ItemDetailsProps) => {
  const formatFieldValue = (value: number | undefined | null) => {
    if (value === undefined || value === null) {
      return <Skeleton className="h-4 w-full" />;
    } else if (value === 0) {
      return 'No value';
    } else {
      return currencyFormatter.format(value);
    }
  };

  const removeItem = async (coin: CoinWatchlistItemWithCoinData) => {
    try {
      await removeItemAction(coin.id);
      toast({
        title: 'Success',
        description: `Removed ${coin.name} from your watchlist.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: error instanceof Error && error.message,
      });
    } finally {
      onModalClose();
    }
  };

  return (
    <>
      {loading ? (
        <div className="space-y-4 p-2">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-20" />
          ))}
        </div>
      ) : (
        itemData && (
          <div className="max-h-[80vh] space-y-4 overflow-auto p-2">
            <Button
              onClick={() => removeItem(itemData)}
              variant={'destructive'}
            >
              <Icons.trash className="mr-2 h-4 w-4" />
              Remove
            </Button>

            <div className="rounded-lg bg-secondary/20 p-4">
              <div className="inline-flex gap-2 text-lg font-semibold">
                <div className="text-muted-foreground">
                  #{itemData.coinData?.marketCapRank}
                </div>
                {itemData.name}
              </div>
              <div className="mb-4 text-3xl font-bold text-primary">
                {formatFieldValue(
                  itemData.coinData?.priceHistories?.[0]?.price,
                )}
              </div>
              {/* data */}
              <div className="grid grid-cols-2 gap-4">
                <div className="font-semibold">Market Cap</div>
                <p className="truncate">
                  {formatFieldValue(itemData.coinData?.marketCap)}
                </p>
                <div className="font-semibold">Volume</div>
                <p className="truncate">
                  {formatFieldValue(itemData.coinData?.volume)}
                </p>
              </div>
              {/*  */}
            </div>
            {/* Next card */}

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-secondary/20 p-4 ">
                <h3 className="font-semibold">High 24h</h3>
                {formatFieldValue(itemData.coinData?.high24h)}
              </div>
              <div className="rounded-lg bg-secondary/20 p-4">
                <h3 className="font-semibold">Low 24h</h3>
                {formatFieldValue(itemData.coinData?.high24h)}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="pb-2 text-2xl font-bold">Price History</div>
              <div className="space-y-2">
                {itemData.coinData?.priceHistories?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded border p-1"
                  >
                    <div className="text-left">
                      {formatFieldValue(item.price)}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <>
                        {/* Top part - Date */}
                        <div>
                          {item.createdAt.toLocaleDateString('en-DE', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>

                        {/* Bottom part - Time */}
                        <div>
                          {item.createdAt.toLocaleTimeString('en-DE', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </div>
                      </>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};
