'use server';

import { Settings } from '@/types';
import { promises as fs } from 'fs';
import path from 'path';

const settingsFilePath = path.join(process.cwd(), 'settings.json');
const defaultSettings = { cronInterval: 10, pro_api: undefined };

/**
 * Reads the settings from the settings file.
 * @returns A promise that resolves with the settings.
 */
export async function readSettings(): Promise<Settings> {
  try {
    const data = await fs.readFile(settingsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Settings file does not exist, creating with default value.');
    await writeSettings(defaultSettings);
    return defaultSettings;
  }
}

/**
 * Writes the settings to the settings file.
 * @param settings - The settings to write to the file.
 * @returns A promise that resolves when the settings have been written.
 */
export async function writeSettings(settings: Settings): Promise<void> {
  await fs.writeFile(settingsFilePath, JSON.stringify(settings), 'utf8');
}

/**
 * Deletes specific parts from the settings based on keys.
 * @param keys - The key(s) of the settings to delete.
 * @returns A promise that resolves when the specified setting part(s) have been deleted.
 */
export async function deleteSettingParts(
  keys: (keyof Settings)[],
): Promise<void> {
  try {
    const currentSettings = await readSettings();

    keys.forEach((key) => {
      delete currentSettings[key];
    });
    await writeSettings(currentSettings);
    keys.forEach((key) => {
      delete currentSettings[key];
      console.log(`${key} has been deleted as it is empty or undefined.`);
    });
  } catch (error) {
    console.log('Error deleting setting part(s):', error);
  }
}
