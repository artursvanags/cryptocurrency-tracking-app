'use client';
import { set, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ControllerProps,
  ControllerRenderProps,
  Field,
  FieldValues,
  FormProps,
  FormProviderProps,
  useForm,
} from 'react-hook-form';
import { FormEvent, use, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button, buttonVariants } from '@/components/ui/button';
import { themeIcons } from '@/config/icons';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

import { Input, InputProps } from '@/components/ui/input';
import {
  Form,
  FormLabel,
  FormDescription,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Settings } from '@/types';
import { pingAPI } from '@/lib/repositories/apiRepository';
import { removeAllItemsAction } from '@/lib/actions/removeAllitems';

const intervalOptions = [10, 20, 30, 40, 50, 60];

const schema = z.object({
  interval: z.number(),
  api: z.string(),
});

type searchSchema = z.infer<typeof schema>;

type SettingsProps = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  onModalClose: () => void;
};

const SettingsTemplate = ({
  settings,
  setSettings,
  onModalClose,
}: SettingsProps) => {
  const { toast } = useToast();
  const { setTheme, resolvedTheme } = useTheme();

  const [apiState, setApiState] = useState<
    'default' | 'pinging' | 'success' | 'error'
  >('default');
  const [isDirty, setIsDirty] = useState(false);
  const form = useForm<searchSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      interval: settings.cronInterval,
      api: settings.pro_api || '',
    },
  });

  const toggleTheme = () => {
    if (resolvedTheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const handleIntervalChange = (value: string) => {
    const newValue = parseInt(value);
    try {
      setSettings({ ...settings, cronInterval: newValue });
      toast({
        title: 'Interval Updated',
        description: `Interval has been updated to ${newValue} seconds.`,
      });
    } catch (error) {
      console.error('Error updating interval', error);
    }
  };

  const handleAPIchange = async (api: string) => {
    setApiState('pinging');
    const newApi = api;
    try {
      const response = await pingAPI();
      if (response) {
        setSettings({ ...settings, pro_api: newApi });
        setApiState('success');
        toast({
          title: 'API Updated',
          description: `API has been ${newApi ? `updated to ${newApi}` : 'removed'}.`,
        });
      }
    } catch (error) {
      console.error('Error updating API', error);
      setApiState('error');
      toast({
        title: 'Error',
        variant: 'destructive',
        description: error instanceof Error && error.message,
      });
    }
  };

  const removeItem = async () => {
    try {
      await removeAllItemsAction();
      toast({
        title: 'Success',
        description: `Removed all coins from your watchlist.`,
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
    <div className="space-y-4 pb-4 lg:pb-0">
      <div
        onClick={() => {
          toggleTheme();
        }}
        className={`${buttonVariants({ variant: 'outline' })} w-full cursor-pointer`}
      >
        <>
          {resolvedTheme === 'light' ? (
            <themeIcons.moon className="mr-4 h-5 w-5" />
          ) : (
            <themeIcons.sun className="mr-4 h-5 w-5" />
          )}
          Dark Mode
          <Switch className="ml-auto" checked={resolvedTheme === 'dark'} />
        </>
      </div>
      <Form {...form}>
        <FormField
          disabled={apiState === 'pinging'}
          control={form.control}
          name="api"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pro API Key</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="Coingecko API Key"
                    {...field}
                    onChange={(value) => {
                      setApiState('default');
                      field.onChange(value);
                      setIsDirty(true);
                    }}
                  />
                </FormControl>
                <Button
                  variant={
                    apiState === 'error'
                      ? 'destructive'
                      : apiState === 'success'
                        ? 'success'
                        : 'default'
                  }
                  disabled={
                    !isDirty || apiState === 'pinging' || apiState === 'success'
                  }
                  onClick={() => handleAPIchange(field.value)}
                >
                  {apiState === 'pinging'
                    ? 'Pinging...'
                    : apiState === 'success'
                      ? 'Success'
                      : 'Save'}
                </Button>
              </div>
              <FormDescription>
                Leave empty to use {``}
                <span className="font-bold">rate-limited Public API</span>{' '}
                access.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Interval</FormLabel>
              <Select
                value={field.value.toString()}
                onValueChange={(value) => {
                  handleIntervalChange(value);
                  field.onChange(value);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {intervalOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option} seconds
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Set interval to refresh the data from the API.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2 border-t pt-2">
          <div className="text-sm font-medium">Danger Zone</div>
          <div className="rounded border border-dashed border-destructive bg-destructive/10 p-4">
            <div className="flex">
              <div className="w-[70%]">
                <p className="text-sm">
                  Once you delete your watchlist, there is no going back. All
                  your data will be lost. Please be certain.
                </p>
              </div>
              <div className="ml-auto flex items-center">
                <Button onClick={() => removeItem()} variant="destructive">
                  Delete All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SettingsTemplate;
