import { Table } from '@tanstack/react-table';
import { DataTableViewOptions } from '@/components/main/components/watchlist-table/data-table-viewoptions';
import AddCoinsModal from '@/components/main/components/add-coins-modal';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}
const thresholdOptions = [10, 25, 50, 75, 100];
export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center gap-2 ">
      {table.getSelectedRowModel().rows.length > 0 && (
        <div className="flex items-center gap-2 ">
          <Button
            variant={'outline'}
            className="border border-dashed"
            onClick={() => table.toggleAllRowsSelected()}
            disabled={table?.getIsAllRowsSelected()}
          >
            Select all
          </Button>
          <Button
            variant={'outline'}
            className="border border-dashed"
            onClick={() => table?.resetRowSelection()}
          >
            Clear selection
          </Button>
        </div>
      )}
      {table.getSelectedRowModel().rows.length > 0 && (
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          <span>
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </span>
        </div>
      )}
      <AddCoinsModal />
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>

        <SelectContent>
          {thresholdOptions.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DataTableViewOptions table={table} />
    </div>
  );
}
