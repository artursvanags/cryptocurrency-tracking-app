import { Table } from '@tanstack/react-table';
import { DataTableViewOptions } from '@/components/main/components/watchlist-table/data-table-viewoptions';
import AddCoinsModalButton from '@/components/main/components/add-coins-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SettingsModalButton from '@/components/settings/components/open-settings-modal';
import { AlertModal } from '@/components/ui/alert-modal';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { removeMultipleItemsAction } from '@/lib/actions/removeMultipleItemsAction';
import { CoinDTO } from '@/types';
import { Icons, actionIcons } from '@/config/icons';
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}
export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { toast } = useToast();
  const [openAlertModal, setAlertModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const selectedRowModel = table.getSelectedRowModel();
  const selectedRowData = selectedRowModel.rows.map((row) => row.original);

  const onDeleteItems = async (data: any) => {
    const ids = data.map((item: any) => item.id);
    setLoading(true);
    try {
      await removeMultipleItemsAction(ids);
      toast({
        title: 'Success',
        description: `Removed ${data.length} coin/-s from your watchlist.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: error instanceof Error && error.message,
      });
    } finally {
      setLoading(false);
      setAlertModalOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openAlertModal}
        onClose={() => setAlertModalOpen(false)}
        onConfirm={() => onDeleteItems(selectedRowData)}
        loading={loading}
        description={`You are about to delete the following:`}
      >
        <div className="flex max-h-48 flex-col overflow-auto rounded-sm bg-stone-100 p-4 font-mono text-xs dark:bg-stone-900 dark:text-amber-200">
          {selectedRowModel.rows.map((row) => (
            <div key={row.id} className="flex items-center gap-2">
              <span>{(row.original as CoinDTO).name}</span>
              <span>{(row.original as CoinDTO).symbol}</span>
            </div>
          ))}
        </div>
      </AlertModal>
      <div className="flex items-center gap-2 ">
        {table.getSelectedRowModel().rows.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border border-dashed">
                <Icons.arrowDown className="mr-2 h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Select actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  table.toggleAllRowsSelected();
                  e.preventDefault();
                }}
                disabled={table?.getIsAllRowsSelected()}
              >
                <actionIcons.selectAll className="mr-2 h-4 w-4" />
                Select all
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table?.resetRowSelection()}>
                <actionIcons.clear className="mr-2 h-4 w-4" />
                Clear selection
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setAlertModalOpen(true)}
                className="cursor-pointer text-red-500"
              >
                <actionIcons.delete className="mr-2 h-4 w-4" />
                Delete selected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex-1 text-xs text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                <span>
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </span>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <div className="ml-auto flex gap-2">
          <AddCoinsModalButton />
          <DataTableViewOptions table={table} />
          <SettingsModalButton />
        </div>
      </div>
    </>
  );
}
