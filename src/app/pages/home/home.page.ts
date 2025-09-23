import { Component } from '@angular/core';
import { Auth } from 'src/app/core/services/auth/auth';
import { File } from 'src/app/core/services/fileService/file';
import { Toast } from 'src/app/core/services/toastService/toast';
import { Uploader } from 'src/app/core/services/UploaderService/uploader';
import { FloatingAction } from 'src/app/shared/components/button/floating-button/floating-button.component';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/services/userServices/user';
import { firstValueFrom } from 'rxjs';
import { supabase } from 'src/app/supabase/supabase';
import { Wallpaper } from 'src/app/shared/services/wallpaperService/wallpaper';
import { Loading } from 'src/app/core/services/loadingService/loading';
import { ActionSheet } from 'src/app/shared/providers/action-sheet';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  public wallpapers$ = this.wallpaperSrv.wallpapers$;
  private supabase = supabase;
  public wallpapers: any[] = [];
  public url: string = '';
  user: any;

  constructor(
    private readonly fileSrv: File,
    private readonly uploaderSrv: Uploader,
    private readonly toastSrv: Toast,
    private readonly authSrv: Auth,
    private readonly router: Router,
    private readonly userSrv: User,
    public readonly wallpaperSrv: Wallpaper,
    private readonly loadingSrv: Loading,
    private readonly actionSheetSrv: ActionSheet
  ) {}

  public async chooseAnImage() {
    console.log('Iniciando chooseAnImage');

    const image = await this.fileSrv.pickImage();
    console.log('Imagen seleccionada:', image);

    if (!image) {
      console.log('No se seleccionó imagen');
      await this.toastSrv.show(
        'No seleccionaste ninguna imagen, intenta de nuevo'
      );
      return;
    }

    console.log('Imagen válida, procediendo a obtener usuario actual');
    const currentUser = await firstValueFrom(
      this.userSrv.getCurrentUser().pipe(filter((u) => !!u))
    );
    console.log('Usuario actual obtenido:', currentUser);

    if (!currentUser) {
      console.log('Usuario no autenticado');
      await this.toastSrv.show('Usuario no autenticado');
      return;
    }

    try {
      await this.loadingSrv.present('subiendo imagen...');

      const folder = `users/${currentUser.uid}`;
       console.log('Folder destino:', folder);
      this.url = await this.uploaderSrv.upload(
        'imagesWallpapers',
        folder,
        `${Date.now()}-${image.name}`,
        image.data || '',
        image.mimeType
      );

      await this.toastSrv.show('Imagen subida con éxito');
      console.log('URL de la imagen subida:', this.url);

      const newWallpaper = { name: image.name, url: this.url };

      const currentWallpapers =
        (await firstValueFrom(this.wallpaperSrv.wallpapers$)) || [];

      console.log('Lista de wallpapers actual:', currentWallpapers);

      this.wallpaperSrv.setWallpapers([newWallpaper, ...currentWallpapers]);
      console.log('Lista de wallpapers actualizada:', [
        newWallpaper,
        ...currentWallpapers,
      ]);
    } catch (err) {
      console.error('Error subiendo la imagen:', err);
      await this.toastSrv.show('Error subiendo la imagen, intenta de nuevo');
    } finally {
      await this.loadingSrv.dismiss();
    }
  }

  floatingActions: FloatingAction[] = [
    {
      icon: 'cloud-upload',
      label: 'Subir',
      handler: () => this.chooseAnImage(),
    },
    {
      icon: 'person-outline',
      label: 'perfil',
      handler: () => this.perfilAccount(),
    },
  ];

  openWallpaper(wall: any) {
    console.log('Abrir wallpaper', wall);
  }

  async perfilAccount() {
    try {
      await this.loadingSrv.present('loading profile...');
      this.router.navigate(['/update']);
    } finally {
      await this.loadingSrv.dismiss();
    }
  }

  async logOut() {
    try {
      await this.loadingSrv.present('logging out...');
      await this.authSrv.logout();
      this.wallpapers = [];
      this.router.navigate(['/login']);
    } finally {
      await this.loadingSrv.dismiss();
    }
  }

  onWallpaperClick(wall: any) {
    this.actionSheetSrv.showWallpaperOptions(wall);
  }

  async ngOnInit() {
    this.userSrv.getCurrentUser().subscribe((user) => {
      if (user) {
        this.wallpaperSrv.getWallpapers(user.uid);
      } else {
        this.wallpaperSrv.clearWallpapers();
      }
    });
  }
}
