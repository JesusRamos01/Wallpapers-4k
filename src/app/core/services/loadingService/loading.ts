import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class Loading {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) {}

  async present(message: string = 'loading...') {
    if (this.loading) return; 

    this.loading = await this.loadingController.create({
      message,
      spinner: 'circles', 
      backdropDismiss: false
    });

    await this.loading.present();
  }
  async dismiss() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
  
}
