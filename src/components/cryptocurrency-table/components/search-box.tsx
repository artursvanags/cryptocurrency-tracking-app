'use client';

import { debounce } from '@/lib/helpers/debounce';
import { colorizeSearchTerm } from '@/lib/helpers/colorizeSearchTerm';
import { UserCoinList } from '@prisma/client';
import { useEffect, useState } from 'react';

import { Input, InputProps } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import prismadb from '@/lib/database';

interface SearchBoxProps extends InputProps {
  data: () => Promise<UserCoinList[]>;
}

const SearchBox = (props: SearchBoxProps) => {
  const [coins, setCoins] = useState<UserCoinList[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<UserCoinList[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch mounted coins from data API
  useEffect(() => {
    const fetchData = async () => {
      const allCoins = await props.data();
      setCoins(allCoins);
      setFilteredCoins(allCoins);
    };
    fetchData();
  }, []);

  const handleSelect = async (coin: UserCoinList) => {
    await prismadb.userCoinList.create({
      data: {
        slug: coin.id,
        name: coin.name,
        symbol: coin.symbol,
      },
    });
    console.log('Coin added to watchlist:', coin.name, coin.symbol);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newSearchTerm = e.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);

    // Input character filter logic
    if (newSearchTerm.length >= 2) {
      const newFilteredCoins = coins
        .filter((coin) => coin.name.toLowerCase().includes(newSearchTerm))
        .sort((a, b) => {
          if (a.name.toLowerCase() === newSearchTerm) return -1;
          if (b.name.toLowerCase() === newSearchTerm) return 1;
          return a.name.localeCompare(b.name);
        });
      setFilteredCoins(newFilteredCoins);
    } else {
      setFilteredCoins([]);
    }
  };

  // Debounce input to prevent too many API calls from user input
  const debouncedHandleInput = debounce(handleInput, 200);

  return (
    <div className="space-y-2">
      <Input
        {...props}
        placeholder="Start searching coins"
        onInput={debouncedHandleInput}
      />
      {searchTerm.length >= 2 && (
        <>
          <ScrollArea className="relative rounded-sm border">
            <div className="max-h-[320px]">
              <Table>
                <TableHeader className="sticky top-0 bg-secondary hover:bg-secondary">
                  <TableRow className="cursor">
                    <TableHead className="w-[100px]">Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoins.length > 0 ? (
                    filteredCoins.map((row) => (
                      <TableRow
                        key={row.id}
                        onClick={() => handleSelect(row)}
                        className="cursor-pointer"
                      >
                        <TableCell>{row.symbol.toUpperCase()}</TableCell>
                        <TableCell>
                          {colorizeSearchTerm(row.name, searchTerm)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-green-500">Active</span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            {filteredCoins.length} - Search Results
          </div>
        </>
      )}
    </div>
  );
};

export default SearchBox;
