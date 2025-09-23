import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from 'src/app/supabase/supabase';

@Injectable({ providedIn: 'root' })
export class Wallpaper {
  private supabase = supabase;
  private wallpapersSubject = new BehaviorSubject<any[]>([]);
  wallpapers$ = this.wallpapersSubject.asObservable();

  constructor() {}

  setWallpapers(images: any[]) {
    this.wallpapersSubject.next(images);
  }

  clearWallpapers() {
    this.wallpapersSubject.next([]);
  }

  async getWallpapers(userId: string) {
    const folder = `users/${userId}`;
    const { data, error } = await this.supabase.storage
      .from('imagesWallpapers')
      .list(folder, {
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      throw error;
    }

    const images = (data || []).map((file) => {
      const { data: urlData } = this.supabase.storage
        .from('imagesWallpapers')
        .getPublicUrl(`${folder}/${file.name}`);
      return {
        name: file.name,
        url: urlData.publicUrl,
      };
    });

    this.setWallpapers(images);
    return images;
  }

  async deleteWallpaper(userId: string, fileName: string) {
    if (!userId || !fileName) {
      console.warn('Faltan parámetros para eliminar wallpaper');
      return;
    }
    const folder = `users/${userId}`;
    const { error } = await this.supabase.storage
      .from('imagesWallpapers')
      .remove([`${folder}/${fileName}`]);

    if (error) {
      console.error('Error eliminando wallpaper:', error);
      throw error;
    }
    const currentWallpapers = this.wallpapersSubject.getValue();
    const updatedWallpapers = currentWallpapers.filter(
      (wallpaper) => wallpaper.name !== fileName
    );
    this.setWallpapers(updatedWallpapers);
  }
}
