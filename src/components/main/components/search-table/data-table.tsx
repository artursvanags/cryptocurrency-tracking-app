'use client';

import { useEffect, useState } from 'react';

import { APICoinList, CoinDTO, CoinWatchlistItemWithCoinData } from '@/types';
import { colorizeSearchTerm } from '@/lib/helpers/colorizeSearchTerm';

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

import { addItemAction } from '@/lib/actions/addItemAction';
import { removeItemAction } from '@/lib/actions/removeItemAction';

interface DataTableProps {
  fetchWatchlist: () => void;
  watchlistData: CoinWatchlistItemWithCoinData[];
  queryData: APICoinList[];
  searchQuery: string | null;
  loading: boolean;
}

export const DataTable = ({
  fetchWatchlist,
  watchlistData,
  queryData,
  searchQuery,
  loading,
}: DataTableProps) => {
  const { toast } = useToast();

  const addItem = async (data: APICoinList) => {
    try {
      await addItemAction(data);
      toast({
        title: 'Success',
        description: `Added ${data.name} to your watchlist.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: error instanceof Error && error.message,
      });
    } finally {
      fetchWatchlist();
    }
  };

  const removeItem = async (data: APICoinList) => {
    const coinID = watchlistData.find(
      (watchlistCoin) => watchlistCoin.slug === data.id,
    );
    try {
      if (coinID) await removeItemAction(coinID);
      toast({
        title: 'Success',
        description: `Removed ${data.name} to your watchlist.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: error instanceof Error && error.message,
      });
    } finally {
      fetchWatchlist();
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
                      <TableRow className="h-4" key={index}>
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
                  ) : searchRows().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  ) : (
                    searchRows().map((row) => (
                      <TableRow key={row.id} className="m-24 h-4">
                        <TableCell>{row.symbol.toUpperCase()}</TableCell>
                        <TableCell>
                          {searchQuery &&
                            colorizeSearchTerm(row.name, searchQuery)}
                        </TableCell>
                        <TableCell className="pr-4 text-right">
                          {isCoinInWatchlist(row) ? (
                            <Button
                              onClick={() => removeItem(row)}
                              variant="destructive"
                            >
                              Remove
                            </Button>
                          ) : (
                            <Button
                              onClick={() => addItem(row)}
                              variant="default"
                            >
                              Add
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
          {searchRows().length !== 0 && (
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              {searchRows().length} - Search Results
            </div>
          )}
        </>
      )}
    </>
  );
};
