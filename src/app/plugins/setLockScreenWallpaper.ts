import { registerPlugin } from "@capacitor/core";

export interface ISetLockScreenWallpaperPlugin {
  setLockScreenWallpaper(options: { url: string }): Promise<{ success: boolean; message: string }>;
}

const SetLockScreenWallpaperPlugin = registerPlugin<ISetLockScreenWallpaperPlugin>("SetLockScreenWallpaper");

export default SetLockScreenWallpaperPlugin;
