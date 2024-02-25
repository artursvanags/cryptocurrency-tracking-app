'use client';

import { CoinWatchlistItemWithCoinData } from '@/types';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { currencyFormatter } from '@/lib/utils';

const formatFieldValue = (value: number | undefined | null) => {
  if (value === undefined) {
    return <Skeleton className="h-4 w-full" />;
  } else if (value === null || value === 0) {
    return (
      <div className="inline items-center rounded-lg border bg-muted p-1 align-middle text-muted-foreground">
        No value
      </div>
    );
  } else {
    return currencyFormatter.format(value);
  }
};

const formatData = (row: Row<CoinWatchlistItemWithCoinData>) => ({
  price: formatFieldValue(row.original.coinData?.priceHistories?.[0]?.price),
  marketCap: formatFieldValue(row.original.coinData?.marketCap),
  volume: formatFieldValue(row.original.coinData?.volume),
  createdAt: row.original.createdAt,
});

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
        onClick={(event) => event.stopPropagation()}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(event) => event.stopPropagation()}
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
      <DataTableColumnHeader
        className="justify-end"
        column={column}
        title="Price"
      />
    ),
    cell: ({ row }) => {
      return <div className="text-right">{formatData(row).price}</div>;
    },
  },
  {
    accessorKey: 'marketCap',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-end"
        column={column}
        title="Market Cap"
      />
    ),
    cell: ({ row }) => {
      return <div className="text-right">{formatData(row).marketCap}</div>;
    },
  },
  {
    accessorKey: 'volume',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-end"
        column={column}
        title="Volume"
      />
    ),
    cell: ({ row }) => {
      return <div className="text-right">{formatData(row).volume}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-end"
        column={column}
        title="Date Created"
      />
    ),
    cell: ({ row }) => {
      const date = new Date(formatData(row).createdAt).toLocaleDateString(
        'en-US',
      );
      return <div className="text-right">{date}</div>;
    },
  },
  /*  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions data={row.original} />,
  }, */
];
