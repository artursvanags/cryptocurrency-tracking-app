'use client';

import { useEffect, useState } from 'react';

import SettingsTemplate from '@/components/settings/template';
import { ModalDrawerComponent } from '@/components/ui/modal-drawer';
import { Button } from '@/components/ui/button';

import { Icons } from '@/config/icons';
import { settingsService } from '@/lib/services/settingsService';
import { Settings } from '@/types';

const SettingsModalButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const service = settingsService;
  const [settings, setSettings] = useState<Settings>({} as Settings);

  useEffect(() => {
    const fetchSettings = async () => {
      setSettings({
        cronInterval: await service.getInterval(),
        pro_api: await service.getAPI(),
      });
    };
    fetchSettings();
  }, []);

  const updateSettings = async (settings: Settings) => {
    await service.updateInterval(settings.cronInterval);
    await service.updateAPI(settings.pro_api);
    return setSettings(settings);
  };

  const onModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ModalDrawerComponent
        title="Settings"
        description="Make changes to your settings here."
        isOpen={isModalOpen}
        onClose={onModalClose}
        className="max-h-screen"
      >
        <SettingsTemplate
          settings={settings}
          setSettings={updateSettings}
          onModalClose={onModalClose}
        />
      </ModalDrawerComponent>
      <Button size="icon" onClick={() => setIsModalOpen(true)}>
        <Icons.settings className="h-5 w-5" />
      </Button>
    </>
  );
};
export default SettingsModalButton;
