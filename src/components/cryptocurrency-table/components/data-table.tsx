import { useEffect, useState } from 'react';

import { APICoinList, CoinDTO } from '@/types';
import { CoinService } from '@/lib/services/coinService';

import { colorizeSearchTerm } from '@/lib/helpers/colorizeSearchTerm';
import { debounce } from '@/lib/helpers/debounce';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface DataTableProps {
  queryData: APICoinList[];
  searchQuery: string | null;
  loading: boolean;
}

export const DataTable = ({
  queryData,
  searchQuery,
  loading,
}: DataTableProps) => {
  const service = new CoinService();

  const { toast } = useToast();

  const [toggleLoading, setToggleLoading] = useState(false);
  const [watchlistData, setWatchlistData] = useState<CoinDTO[]>([]);

  const fetchData = async () => {
    setToggleLoading(true);
    try {
      const data = await service.getCoins();
      setWatchlistData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setToggleLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleItem = async (
    data: APICoinList,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const button = event.currentTarget;
    button.disabled = true;
    try {
      const watchlist = await service.getCoins();
      const coinExists = watchlist.some((coin) => coin.slug === data.id);

      if (coinExists) {
        const selectedCoin = watchlist.find((coin) => coin.slug === data.id);
        if (selectedCoin) {
          await service.removeItem(selectedCoin.id);
        }
      } else {
        await service.addItem(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      toast({
        title: 'Success',
        description: `${
          isCoinInWatchlist(data) ? 'Removed' : 'Added'
        } ${data.name} to your watchlist.`,
      });
      fetchData();
      button.disabled = false;
    }
  };

  const isCoinInWatchlist = (coin: APICoinList) =>
    watchlistData.some((watchlistCoin) => watchlistCoin.slug === coin.id);

  const searchRows = () => {
    if (searchQuery && searchQuery.length >= 2) {
      return queryData
        .filter((coin) => coin.name.toLowerCase().includes(searchQuery))
        .sort((a, b) => {
          if (a.name.toLowerCase() === searchQuery) return -1;
          if (b.name.toLowerCase() === searchQuery) return 1;
          return a.name.localeCompare(b.name);
        });
    } else {
      return queryData.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  return (
    <>
      {searchQuery && searchQuery.length >= 2 && (
        <>
          <ScrollArea className="relative rounded-sm border">
            <div className="max-h-[70vh]">
              <Table>
                <TableHeader className="sticky top-0 bg-secondary hover:bg-secondary">
                  <TableRow>
                    <TableHead className="w-[100px]">Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="pr-4 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from(Array(3)).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell className="w-[100px]">
                          <Skeleton className="h-6 w-full rounded" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-full rounded" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-full rounded" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : queryData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  ) : (
                    searchRows().map((row) => (
                      <TableRow key={row.id} className="m-24">
                        <TableCell>{row.symbol.toUpperCase()}</TableCell>
                        <TableCell>
                          {searchQuery &&
                            colorizeSearchTerm(row.name, searchQuery)}
                        </TableCell>
                        <TableCell className="pr-4 text-right">
                          <Button
                            onClick={(event) => toggleItem(row, event)}
                            variant={
                              isCoinInWatchlist(row) ? 'destructive' : 'default'
                            }
                          >
                            {isCoinInWatchlist(row) ? 'Remove' : 'Add'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            {searchRows().length} - Search Results
          </div>
        </>
      )}
    </>
  );
};
