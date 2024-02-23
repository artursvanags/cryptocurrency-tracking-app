'use client';

import { CoinWatchlistItemWithCoinData } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<CoinWatchlistItemWithCoinData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          {row.original.coinData?.priceHistories?.[0]?.price || <Skeleton className="h-4 w-full" />}
        </div>
      );
    },
  },
  {
    accessorKey: 'marketCap',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MarketCap" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          {row.original.coinData?.marketCap || (
            <Skeleton className="h-4 w-full" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'volume',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Volume" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          {row.original.coinData?.volume || <Skeleton className="h-4 w-full" />}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt).toLocaleDateString('en-US');
      return <div>{date}</div>;
    },
  },
  /*  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions data={row.original} />,
  }, */
];
