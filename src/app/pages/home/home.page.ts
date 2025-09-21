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



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
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
    private wallpaperSrv: Wallpaper, 
    private readonly loadingSrv: Loading) { }

  public async chooseAnImage() {
    const image = await this.fileSrv.pickImage();
    if (!image) {
      await this.toastSrv.show('No seleccionaste ninguna imagen, intenta de nuevo');
      return;
    }


    const currentUser = await firstValueFrom(this.userSrv.getCurrentUser()); // suponiendo que tu Auth tiene esto
    if (!currentUser) {
      await this.toastSrv.show('Usuario no autenticado');
      return;
    }

    const folder = `users/${currentUser.uid}`;
    this.url = await this.uploaderSrv.upload(
      'imagesWallpapers',
      folder,
      `${Date.now()}-${image.name}`,
      image.data || '',
      image.mimeType
    );

    await this.toastSrv.show('Imagen subida con éxito');
  }



  floatingActions: FloatingAction[] = [
    { icon: 'cloud-upload', label: 'Subir', handler: () => this.chooseAnImage() },
    { icon: 'heart', label: 'Favoritos', handler: () => this.goFavorites() },
    { icon: 'refresh', label: 'Recargar', handler: () => this.reloadWallpapers() },
    { icon: 'person-outline', label: 'perfil', handler: () => this.perfilAccount() }
  ];

  async loadWallpapers(uid: string) {
    try {

      await this.loadingSrv.present('loading wallpapers...');
      const { data, error } = await this.supabase
        .storage
        .from('imagesWallpapers')
        .list('users/' + uid);

      if (error) {
        await this.toastSrv.show('Error loading wallpapers, try again later');
        this.wallpapers = [];
        return;
      }

      this.wallpapers = data.map(file => {
        const { publicUrl } = this.supabase
          .storage
          .from('imagesWallpapers')
          .getPublicUrl(`users/${uid}/${file.name}`).data;

        return { ...file, url: publicUrl };
      });
    } catch (err) {
      await this.toastSrv.show('Error loading wallpapers, try again later');
      this.wallpapers = [];
    }finally {
      await this.loadingSrv.dismiss();
    }
  }

  openWallpaper(wall: any) {
    console.log('Abrir wallpaper', wall);

  }

  perfilAccount() {
    try{
      this.loadingSrv.present('loading profile...');
      this.router.navigate(['/update']);

    }finally{
      this.loadingSrv.dismiss();
    }
    
  }

  uploadWallpaper() {
    console.log('Abrir modal de subida');

  }

  goFavorites() {
    console.log('Ir a favoritos');
  }

  async logOut() {

    try{
      await this.loadingSrv.present('logging out...');
      await this.authSrv.logout();
      this.wallpapers = [];
      this.router.navigate(['/login']);
    }finally{
      await this.loadingSrv.dismiss();
    }
    
  }

  reloadWallpapers() {
    console.log('Recargar lista de wallpapers');
  }

  onFloatingAction(ev: any) {
    console.log('Acción FAB:', ev);
  }
  async ngOnInit() {
    this.userSrv.getCurrentUser().subscribe(user => {
      if (user) this.loadWallpapers(user.uid);
      else this.wallpapers = [];
    });
  }

}
