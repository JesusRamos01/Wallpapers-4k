import { Injectable } from '@angular/core';
import { Toast as capacitorToast } from '@capacitor/toast';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class Toast {
  constructor(private toastCtrl: ToastController) { }
  async show(
    message: string,
    position: 'top' | 'center' | 'bottom' = 'bottom',
    useController: boolean = false
  ) {
    try {
      if (useController) {

        const toast = await this.toastCtrl.create({
          message,
          duration: 2000,
          position: position === 'center' ? 'middle' : position, 
          color: 'primary'
        });
        await toast.present();
      } else {
        await capacitorToast.show({
          text: message,
          position
        });
      }
    } catch (error) {
      console.error('Error mostrando toast:', error);
    }
  }
}
