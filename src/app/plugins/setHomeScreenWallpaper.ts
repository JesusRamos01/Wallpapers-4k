import { registerPlugin } from "@capacitor/core";

export interface ISetHomeScreenWallpaperPlugin {
  setHomeScreenWallpaper(options: { url: string }): Promise<{ success: boolean; message: string }>;
}

const SetHomeScreenWallpaperPlugin = registerPlugin<ISetHomeScreenWallpaperPlugin>(
  "SetHomeScreenWallpaper"
);

export default SetHomeScreenWallpaperPlugin;

