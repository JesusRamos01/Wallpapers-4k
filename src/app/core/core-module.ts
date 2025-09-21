import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { File } from './services/fileService/file';
import { Capacitor } from '@capacitor/core';
import { Uploader } from './services/UploaderService/uploader';
import {
  initializeApp, provideFirebaseApp
} from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { Auth } from './services/auth/auth';
import {provideFirestore, getFirestore} from '@angular/fire/firestore';
import { Query } from './services/queryService/query';


const services = [File];


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [...services, provideFirebaseApp(() => initializeApp(environment.FIREBASE_APP)), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),Auth, Query], 
})
export class CoreModule implements OnInit {
  constructor(private readonly fileSrv: File) {
    this.ngOnInit();
  }

  async ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      await this.fileSrv.requestPermission();

    }

  }

}
