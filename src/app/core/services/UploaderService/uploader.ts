import { Injectable } from '@angular/core';
import { supabase } from 'src/app/supabase/supabase';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class Uploader {
  constructor(private auth: Auth, private firestore: Firestore) {}

  
  async upload(bucket: string, folder: string, fileName: string, fileData: string, contentType: string): Promise<string> {
   
    const { data, error } = await supabase.storage.from(bucket).upload(
      `${folder}/${fileName}`, 
      Uint8Array.from(atob(fileData), c => c.charCodeAt(0)), 
      { contentType }
    );

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    const signedUrl = await this.getSignUrl(bucket, data?.path || '');

    const currentUser = await this.auth.currentUser;
    if (currentUser) {
      const imagesRef = collection(this.firestore, 'user_images');
      await addDoc(imagesRef, {
        uid: currentUser.uid,
        url: signedUrl,
        name: fileName,
        createdAt: Timestamp.now()
      });
    }

    return signedUrl;
  }

  async getSignUrl(bucket: string, name: string): Promise<string> {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(name, 86400);
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    return data?.signedUrl || '';
  }
}
