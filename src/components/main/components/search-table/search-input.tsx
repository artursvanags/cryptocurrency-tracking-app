'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useCallback } from 'react';

import { debounce } from '@/lib/helpers/debounce';

import { Input, InputProps } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

const schema = z.object({
  search: z.string().min(2).max(5),
});

type searchSchema = z.infer<typeof schema>;

interface SearchBoxProps extends InputProps {
  searchQuery: string | null;
  setSearchQuery: (searchTerm: string | null) => void;
}

const SearchInput = ({
  searchQuery,
  setSearchQuery,
  ...inputProps
}: SearchBoxProps) => {
  const form = useForm<searchSchema>({
    resolver: zodResolver(schema),
    defaultValues: { search: searchQuery || '' },
  });

  const debouncedHandleInput = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 200),
    [setSearchQuery],
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default SearchInput;
