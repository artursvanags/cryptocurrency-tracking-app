import {
  readSettings,
  writeSettings,
  deleteSettingParts,
} from '@/lib/repositories/settingsRepository';
import { Settings } from '@/types';

class SettingsService {
  private static instance: SettingsService;
  private settings: Settings;

  private constructor() {
    this.settings = { cronInterval: 10, pro_api: 'STR' };
    this.refreshSettings = this.refreshSettings.bind(this);
    this.updateInterval = this.updateInterval.bind(this);
    this.updateAPI = this.updateAPI.bind(this);
    this.getInterval = this.getInterval.bind(this);
    this.getAPI = this.getAPI.bind(this);
  }

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  async refreshSettings(): Promise<void> {
    this.settings = await readSettings();
  }

  async updateInterval(interval: number): Promise<void> {
    await this.refreshSettings();
    this.settings.cronInterval = interval;
    await writeSettings(this.settings);
  }

  async updateAPI(api: Settings['pro_api']): Promise<void> {
    await this.refreshSettings();

    if (api === undefined || api === '') {
      if (this.settings.pro_api !== undefined) {
        await deleteSettingParts(['pro_api']);
      }
    } else {
      this.settings.pro_api = api;
      await writeSettings(this.settings);
    }
  }

  async getInterval(): Promise<number> {
    await this.refreshSettings();
    return this.settings.cronInterval;
  }

  async getAPI(): Promise<string | undefined> {
    await this.refreshSettings();
    return this.settings.pro_api;
  }
}

export const settingsService = SettingsService.getInstance();
