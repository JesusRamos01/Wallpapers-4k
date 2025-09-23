import { Injectable } from '@angular/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Toast } from '../toastService/toast';

@Injectable({
  providedIn: 'root'
})
export class File {
  constructor(private toast: Toast) { }

  async requestPermission() {
    try {
      await FilePicker.requestPermissions();
    } catch (error) {
      await this.toast.show('Error requesting file permissions', 'center');
      
    }
  }

  async pickImage() {
    try {
      const image = await FilePicker.pickImages({
        limit: 1,
        readData: true,
       
      });
      const images = image.files[0];
      return{
        data: images.data,
        name: images.name,
        mimeType: images.mimeType
      }
      
    } catch (error) {
      await this.toast.show('Error al cargar la imagen', 'center');
      throw error;
    }
  }
}
