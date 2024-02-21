'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { debounce } from '@/lib/helpers/debounce';
import { colorizeSearchTerm } from '@/lib/helpers/colorizeSearchTerm';

import { Input, InputProps } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { APICoinList } from '@/types';
import { useCallback } from 'react';

const schema = z.object({
  search: z.string().min(2).max(5),
});
type searchSchema = z.infer<typeof schema>;

interface SearchBoxProps extends InputProps {
  data: APICoinList[];
  loading: boolean;
  searchQuery: string | null;
  setSearchQuery: (searchTerm: string | null) => void;
}

const SearchBox = ({
  data,
  loading,
  searchQuery,
  setSearchQuery,
  ...inputProps
}: SearchBoxProps) => {
  const form = useForm<searchSchema>({
    resolver: zodResolver(schema),
    defaultValues: { search: searchQuery || '' },
  });
  const searchRows = () => {
    if (searchQuery && searchQuery.length >= 2) {
      return data
        .filter((coin) => coin.name.toLowerCase().includes(searchQuery))
        .sort((a, b) => {
          if (a.name.toLowerCase() === searchQuery) return -1;
          if (b.name.toLowerCase() === searchQuery) return 1;
          return a.name.localeCompare(b.name);
        });
    } else return data.sort((a, b) => a.name.localeCompare(b.name));
  };

  const debouncedHandleInput = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 200),
    [], // Dependencies array, empty means the function is created once
  );

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...inputProps}
                    {...field}
                    type="search"
                    placeholder="Start searching coins"
                    onChange={(e) => {
                      field.onChange(e);
                      debouncedHandleInput(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {searchQuery && searchQuery.length >= 2 && (
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
                  {loading ? (
                    Array.from(Array(3)).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell className="w-[100px]">
                          <Skeleton className="h-6 w-full rounded" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-full rounded" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-6 w-full rounded" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  ) : (
                    searchRows().map((row) => (
                      <TableRow key={row.id} className={`cursor-pointer `}>
                        <TableCell>{row.symbol.toUpperCase()}</TableCell>
                        <TableCell>
                          {colorizeSearchTerm(row.name, searchQuery)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-green-500">Active</span>
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
    </div>
  );
};

export default SearchBox;
