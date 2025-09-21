import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from 'src/app/supabase/supabase';

@Injectable({ providedIn: 'root' })
export class Wallpaper {
  private supabase = supabase;
  constructor() {}
  private wallpapersSubject = new BehaviorSubject<any[]>([]);
  wallpapers$ = this.wallpapersSubject.asObservable();

  setWallpapers(images: any[]) {
    this.wallpapersSubject.next(images);
  }

  

  clearWallpapers() {
    this.wallpapersSubject.next([]);
  }

  async getWallpapers(userId: string) {
    const { data, error } = await this.supabase
      .from('wallpapers')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  }
}