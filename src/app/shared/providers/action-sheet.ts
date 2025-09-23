import { Injectable } from '@angular/core';
import { ActionSheetController, ToastController } from '@ionic/angular';
import SetLockScreenWallpaperPlugin from 'src/app/plugins/setLockScreenWallpaper';
import SetHomeScreenWallpaperPlugin from 'src/app/plugins/setHomeScreenWallpaper';
import { Toast } from 'src/app/core/services/toastService/toast';
import { Wallpaper } from '../services/wallpaperService/wallpaper';
import { User } from '../services/userServices/user';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ActionSheet {
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private readonly toastSrv: Toast,
    private readonly wallpaperSrv: Wallpaper,
    private readonly userSrv: User
  ) {}
  async showWallpaperOptions(wall: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Establecer fondo',
      buttons: [
        {
          text: 'Pantalla de inicio',
          icon: 'home',
          handler: () => this.setHomeWallpaper(wall.url),
        },
        {
          text: 'Pantalla de bloqueo',
          icon: 'lock-closed',
          handler: () => this.setLockWallpaper(wall.url),
        },
        {
        text: 'Eliminar',
        icon: 'trash',
        handler: async () => {
          try {
            this.toastSrv.show('Eliminando wallpaper...', 'bottom', true);
            const currentUser = await firstValueFrom(this.userSrv.getCurrentUser());
            if (!currentUser) {
              console.log('Usuario no autenticado');
              return;
            }
            if (!wall.name) {
              console.error('Faltan parámetros para eliminar wallpaper');
              return;
            }

            await this.wallpaperSrv.deleteWallpaper(currentUser.uid, wall.name);
            console.log('Wallpaper eliminado:', wall.name);
          } catch (err) {
            console.error('Error eliminando wallpaper:', err);
          }finally{
            this.toastSrv.show('Proceso de eliminación completado', 'bottom', true);
          }
        },
      },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close',
        },
      ],
    });

    await actionSheet.present();
  }

  private async setHomeWallpaper(url: string) {
    try {
      const result = await SetHomeScreenWallpaperPlugin.setHomeScreenWallpaper({
        url,
      });
      this.toastSrv.show(result.message, 'bottom', true);
    } catch (error) {
      this.toastSrv.show('Error al establecer fondo de inicio');
      console.error(error);
    }
  }

  private async setLockWallpaper(url: string) {
    try {
      const result = await SetLockScreenWallpaperPlugin.setLockScreenWallpaper({
        url,
      });
      this.toastSrv.show(result.message, 'bottom', true);
    } catch (error) {
      this.toastSrv.show('Error al establecer fondo de bloqueo');
      console.error(error);
    }
  }
}
