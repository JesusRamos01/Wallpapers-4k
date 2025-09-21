import { Injectable } from '@angular/core';
import { Toast as capacitorToast  } from '@capacitor/toast';


@Injectable({
  providedIn: 'root'
})
export class Toast  {
  constructor() { }

 async show(
  message: string,
  position: 'top' | 'center' | 'bottom' = 'bottom'

) {
  try {
    await capacitorToast.show({
      text: message,
      position: position
    });
  } catch (error) {
    console.error('Error mostrando toast:', error);
  }
}
  
}
